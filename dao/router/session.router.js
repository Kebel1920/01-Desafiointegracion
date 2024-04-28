    import { Router } from "express";
    import { UsuariosManagerMongo } from "../usuariosManagerMONGO.js";
    import { creaHash, validaPassword } from "../dao.factory.js";
    import jwt from "jsonwebtoken";
    import * as dotenv from 'dotenv';
    import { authenticateToken } from "../middlewares/auth.jwt.js";

    dotenv.config();
    const SECRET= process.env.MONGOPASSWORD

    const router=Router()

    let usuariosManager=new UsuariosManagerMongo()

    router.post ('/registro',async (req,res)=>{
        const {nombre, email, password} =req.body
        if(!nombre || !email || !password){
            return res.redirect("/registro?error=Faltan datos")
        }

        const existe=await usuariosManager.getBy({email})
        if(existe){

            return res.redirect(`/registro?error=Ya existen usuarios con email ${email}`)

        }

        // validaciones extra...
        const hashedPassword=creaHash(password);

        try {
            const nuevoUsuario= await usuariosManager.create({nombre, email, password: hashedPassword});

            // res.setHeader('Content-Type','application/json');
            // res.status(200).json({payload:"Registro exitoso", nuevoUsuario});
            return res.redirect(`/registro?mensaje=Registro exitoso para ${nombre}`);

        } catch (error) {
            return res.redirect(`/registro?error=Error 500 - error inesperado`)
            
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
        res.status(200).json({ message: "Login correcto", usuario: { nombre: usuario.nombre, email: usuario.email }, token });

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
    //     req.session.destroy(e=>{
    //         if(e){
    //             res.setHeader('Content-Type','application/json');
    //             return res.status(500).json(
    //                 {
    //                     error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
    //                     detalle:`${e.message}`
    //                 }
    //             )
                
    //         }
    //     });
        
        
    //     res.setHeader('Content-Type','application/json');
    //     res.status(200).json({
    //         message:"Logout exitoso"
        
    //     });

    //     let token=jwt.sign(usuario, SECRET, {expiresIn: 60*5})

    //     res.setHeader('Content-Type','application/json')
    //     res.status(200).json({
    //         status:"ok", usuario, token  //     })

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
    

export {router} 



