import { MongoProduct } from "../models/mongo.models.js";

export async function getProductUsuario(userId) {
    try {
        if (!req.session.usuario){
            return res.status (401).json ({error: "Usuario no autenticado"});
        }

        const userId = req.session.usuario._id;

        const productos = await MongoProduct.find({userId });
        return res.status (200).json(productos);
    } catch (error) {
        return res.status (500).json({error: 'Error al obtener los productos del usuario'});
    }
}
