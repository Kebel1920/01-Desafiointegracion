import passport from "passport";
import local from  "passport-local"
import { UsuariosManagerMongo } from "../usuariosManagerMONGO.js";
// import { MongoConnection } from "../connections/mongo.connection.js";
import { creaHash, validaPassword } from "../dao.factory.js";
import { rolModel } from "../models/rol.model.js";
// const mongoConnection = new MongoConnection ();
// await mongoConnection.connect(); 

const usuariosManager = new UsuariosManagerMongo ();



export const inicializaPassport =()=>{


    passport.use (
        "record",
        new local.Strategy(
            {
                usernameField: "email",
                passReqToCallback: true
            },
            async function (req, username, password, done){
                try{
                    let {nombre, email}=req.body
                    if(!nombre || !email){
                        return done (null,false)
                    }
                    let existe = await usuariosManager.getBy({email})
                    if (existe) {
                        return done(null,false)
                    }
                    // Validacion extra
                    password=creaHash(password)

                    let rol=await rolModel.findOne({descrip:"usuario"})
                    if(!rol){
                        rol=await rolModel.create({descrip:"usuario"})
                    }
                    rol:rol._id
                    
                    let nuevoUsuario = await usuariosManager.create ({nombre, email, password,rol})
                    return done (null,nuevoUsuario)

                } catch (error) {
                    return done (error)
                }
            }
        )
    )

    passport.use (
        "login",
        new local.Strategy (
            {
                usernameField: "email"
            },
            async (username, password, done)=>{
                try{
                    console.log ({username})
                    let usuario= await usuariosManager.getBy ({email:username})
                    if(!usuario){
                        return done (null,false)
                    }

                    if (!validaPassword (usuario, password)){
                        return done (null, false)
                    }

                    return done (null, usuario)

                } catch (error) {
                    return done (error)
                }
            }
        )
    )

    // 1') SOLO SI USAN SESSION (sesiones), definir serializer y deserializer
    passport.serializeUser((usuario, done)=>{
        return done(null, usuario._id)
    })

    passport.deserializeUser(async (id, done)=>{
        let usuario=await usuariosManager.getBy({_id:id})

        return done(null, usuario)
    })
}
