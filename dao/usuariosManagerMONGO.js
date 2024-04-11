import { usuariosModel } from "./models/usuarios.model.js";

class UsuariosManagerMongo {
    async create (usuario){
        let nuevoUsuario=await usuariosModel.create(usuario)
        return nuevoUsuario.toJSON
    }

    async getBy (filtro){
        return await usuariosModel.findOne(filtro).lean()
    }
}

export {UsuariosManagerMongo}