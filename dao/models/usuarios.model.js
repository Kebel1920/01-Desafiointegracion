import mongoose from "mongoose";

const usuariosModel=mongoose.model(
    'usuarios',
    new mongoose.Schema(
        {
            nombre: String, 
            email: {
                type: String, unique:true
            }, 
            password: String,
            role:{
                // type: mongoose.Types.ObjectId,
                // ref: "roles"
                type: String,
                default: 'user'
            },
        },
        {
            timestamps:true, strict:false
        }
    )
)


export {usuariosModel}


