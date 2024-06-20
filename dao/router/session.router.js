    import { Router } from "express";
    import { UsuariosManagerMongo } from "../usuariosManagerMONGO.js";
    import { creaHash, validaPassword,SECRET } from "../dao.factory.js";
    import jwt from "jsonwebtoken";
    // import * as dotenv from 'dotenv';
    import { authenticateToken } from "../middlewares/auth.jwt.js";
    // import { usuariosModel } from "../models/usuarios.model.js";
    import sendEmail from "../../nodemailer/nodemailer.js";
import { usuariosModel } from "../models/usuarios.model.js";




    const router=Router()

    let usuariosManager=new UsuariosManagerMongo()

    router.post ('/record',async (req,res)=>{
        const {nombre, email, password} =req.body
        if(!nombre || !email || !password){
            return res.redirect("/record?error=Faltan datos")
            // return res.status(400).json({error:`Faltan datos`});
        }

        const existe=await usuariosManager.getBy({email})
        if(existe){

            return res.redirect(`/record?error=Ya existen usuarios con email ${email}`)
            // return res.status(409).json({error:`Ya existen usuarios con email ${email}`});

        }

        // validaciones extra...
        const hashedPassword=creaHash(password);

        try {
            const nuevoUsuario= usuariosManager.create({nombre, email, password: hashedPassword});

            // res.setHeader('Content-Type','application/json');
            // res.status(200).json({payload:"Registro exitoso", nuevoUsuario});
            return res.redirect(`/record?mensaje=Registro exitoso para ${nombre}`);
            // return res.status(201).json({message:`Registro exitoso para ${nombre}`});

        } catch (error) {
            // return res.redirect(`/registro?error=Error 500 - error inesperado`)
            return res.status(500).json({error:`Error 500 - error inesperado`});
            
        }


    })

    router.post('/login',async(req,res)=>{
        const {email, password} =req.body;
        if(!email || !password){
            // res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:`Faltan datos`});
        }

        const usuario=await usuariosManager.getBy({email})
        if(!usuario || !validaPassword(usuario, password)){
            // res.setHeader('Content-Type','application/json');
            return res.status(401).json({error:`Credenciales incorrectas`});
        }

        const token = jwt.sign ({id: usuario._id}, SECRET, {expiresIn: '1h'});
        res.status(200).json({ message: "Login correcto", usuario: { nombre: usuario.nombre, email: usuario.email } });

    });
    //     if(usuario.password!==creaHash(password)){}
    //         if (!validaPassword (usuario, password)){
    //             res.setHeader('Content-Type','application/json');
    //             return res.status(401).json({error:`Credenciales incorrectas`})

    //         }
        
        

    //     usuario={...usuario}
    //     delete usuario.password
    //     req.session.usuario=usuario // en un punto de mi proyecto

    //     res.setHeader('Content-Type','application/json')
    //     res.status(200).json({
    //         message:"Login correcto", usuario
    //     })
    // })

//  router.get('/logout',(req,res)=>{

//         res.status(200).json({ message: "Desconectado con éxito" });
//     });
//         req.session.destroy(error=>{
//             if(error){
//                 res.setHeader('Content-Type','application/json');
//                 return res.status(500).json(
//                     {
//                         error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
//                         detalle:`${error.message}`
//                     }
//                 )
                
//             }
//         });
        
        
//         res.setHeader('Content-Type','application/json');
//         res.status(200).json({
//             message:"Logout exitoso"
        
//         });

//         let token=jwt.sign(usuario, SECRET, {expiresIn: 60*5})

//         res.setHeader('Content-Type','application/json')
//         res.status(200).json({
//             status:"ok", usuario, token  
//         })



    router.get('/current', authenticateToken, async (req, res) => {
        const userId = req.user.id; // El ID del usuario extraído del token
        try {
            const usuario = await usuariosManager.getBy({ _id: userId });
            if (!usuario) {
                return res.status(404).json({ error: "Usuario no encontrado" });
            }
            // Envía información relevante del usuario, no incluir el password u otra información sensible
            const userInfo = {
                nombre: usuario.nombre,
                email: usuario.email,
                role: usuario.role  // Asumiendo que hay un campo 'role' en tus usuarios
            };
            res.status(200).json({ usuario: userInfo });
        } catch (error) {
            res.status(500).json({ error: "Error interno del servidor" });
        }
    });
    


    router.post("/recover01", async(req, res)=>{
        let {email}= req.body
        if(!email){
            //     res.setHeader('Content-Type','application/json');
            //     return res.status(400).json({error:`Complete email`})
            return res.status(400).json({error:"Por favor complete el campo de email."});
        }
    
    
        const usuario=await usuariosModel.findOne({email});
        if(!usuario){
        //     res.setHeader('Content-Type','application/json');
        //     return res.status(400).json({error:`No existe usuario...!!!`})
            return res.status(400).json({ error: "No existe usuario con ese email." });
        }

        // Verificar el tiempo de solicitud
        const oneHour = 60 * 60 * 1000;
        const now = new Date ();

        if (usuario.lastPasswordResetRequest && (now - usuario.lastPasswordResetRequest) < oneHour){
            return res.status(400).json({error: "Ya ha solicitado la recuperación de contraseña hace menos de una hora. Por favor, espere antes de volver a intentarlo."})
        }

        //Actualizar el tiempo de solicitud
        usuario.lastPasswordResetRequest = now;
        await usuario.save();
        
    
        // delete usuario.password; // eliminar datos confidenciales...

        let token=jwt.sign({id:usuario._id },SECRET, {expiresIn:"1h"})
        let url=`http://localhost:8080/recover02?token=${token}`;
        let mensaje=`Ha solicitado reinicio de password. Si no fue usted, avise al admin... para continuar haga click <a href="${url}">aqui</a>`
    
            try {
                await sendEmail(email, "Recupero de password", mensaje);
                res.redirect("/recover01?mensaje=Recibira un email en breve. Siga los pasos...");
            } catch (error) {
            // console.log(error);
            // res.setHeader('Content-Type','application/json');
            // return res.status(500).json(
            console.error("Error en el proceso de recuperación de contraseña:", error);
            res.status(500).json({
                    error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                    detalle:error.message
            
                });
            }
    
    });
    


    router.post("/recover03", async (req, res) => {
        const { token, newPassword, newPassword2 } = req.body;
        if (!token || !newPassword || !newPassword2) {
            return res.status(400).json({ error: "Faltan datos" });
        }

        if (newPassword !== newPassword2){
            return res.status(400).json({error: "Las contraseñas no coinciden"});
        }
    
        try {
            const decoded = jwt.verify(token, SECRET);
            const usuario = await usuariosModel.findById(decoded.id);
            if (!usuario) {
                return res.status(400).json({ error: "Usuario no encontrado" });
            }
    
            const hashedPassword = creaHash(newPassword);
            usuario.password = hashedPassword;
            await usuario.save();
            // await usuariosManager.update(usuario._id, usuario);
    
            res.status(200).json({ message: "Contraseña actualizada con éxito" });
        } catch (error) {
            console.error("Error al restablecer la contraseña:", error);
            res.status(500).json({
                error: "Error inesperado en el servidor - Intente más tarde, o contacte a su administrador",
                detalle: error.message
            });
        }
    });


export {router} 



