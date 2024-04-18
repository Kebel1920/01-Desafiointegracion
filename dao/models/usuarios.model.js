import mongoose from "mongoose";

const usuariosModel=mongoose.model(
    'usuarios',
    new mongoose.Schema(
        {
            nombre: String, 
            email: {
                type: String, unique:true
            }, 
            apellido: String, 
            password: String,
        },
        {
            timestamps:true, strict:false
        }
    )
)

export {usuariosModel}