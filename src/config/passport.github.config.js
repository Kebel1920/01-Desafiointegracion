import passport from "passport"
import github from "passport-github2"
import { usuariosModel } from "../../dao/models/usuarios.model.js"


export const initPassport=()=>{

    passport.use(
        "github",
        new github.Strategy(
            {
                clientID:"Iv1.af2d67b2a9280931",
                clientSecret:"9b58cac7dae293f7915176b9c82488f71eb4e4f8",
                callbackURL:"http://localhost:8080/api/sessions/callbackGithub",
            },
            async function(accessToken, refreshToken, profile, done){
                try {
                    // console.log(profile)
                    // profile.email[0].value
                    // return done(null, false)  // falta password
                    // return done(null, usuario)  // todo salió OK
                    let nombre=profile._json.name
                    let email=profile._json.email
                    if(!email){
                        return done(null, false)
                    }
                    let usuario=await usuariosModel.findOne({email})
                    if(!usuario){
                        usuario=await usuariosModel.create({
                            nombre, email, 
                            profileGithub: profile
                        })
                    }

                    return done(null, usuario)
                } catch (error) {
                    return done(error)
                }
            }
        )
    )

    // 1') solo si manejas sesiones
    passport.serializeUser((usuario, done)=>{
        return done(null, usuario._id)
    })

    passport.deserializeUser((usuario, done)=>{
        return done(null, usuario)
    })

}