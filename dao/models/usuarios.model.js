// import mongoose from "mongoose";

// const usuariosModel =  mongoose.model(
//     'usuarios',
//     new mongoose.Schema(
//         {
//             nombre: String, 
//             email: {
//                 type: String, unique:true
//             }, 
//             password: String,
//             role:{
//                 // type: mongoose.Types.ObjectId,
//                 // ref: "roles"
//                 type: String,
//                 default: 'user'
//             },

//             // Campo para almacenar el tiempo de solicitud del reset
//             lastPasswordResetRequest: {
//                 type: Date,
//                 default: null
//             }
//         },
//         {
//             timestamps:true, strict:false
//         }
//     )
// )


// export {usuariosModel}




import mongoose from "mongoose";

const usuariosSchema = new mongoose.Schema(
    {
        nombre: String, 
        email: {
            type: String, unique: true
        }, 
        password: String,
        role: {
            type: String,
            default: 'user'
        },
        lastPasswordResetRequest: {
            type: Date,
            default: null
        },
    },
    {
        timestamps: true, strict: false
    }
);

const usuariosModel = mongoose.model('usuarios', usuariosSchema);

export { usuariosModel };



