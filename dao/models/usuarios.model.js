import mongoose from "mongoose";

const usuariosModel=mongoose.model('usuarios',new mongoose.Schema({
    nombre: String,
    email: {
        type: String, unique:true
    },

password: String

}))

export {usuariosModel}