import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
    name: String,
    reference: String
});

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
        documents: [documentSchema],
        last_connection: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true, strict: false
    }
);

const usuariosModel = mongoose.model('usuarios', usuariosSchema);

export { usuariosModel };



