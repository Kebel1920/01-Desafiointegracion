import mongoose from "mongoose";

const usuariosModel=mongoose.model(
    'usuarios',
    new mongoose.Schema(
        {
            first_name: String, 
            last_name: String,
            email: {
                type: String, unique:true
            }, 
            password: String,
            age: Number,
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


