// import { MongoProduct } from "../models/mongo.models.js";

// export async function getProductUsuario(userId) {
//     try {
//         if (!req.session.usuario){
//             return res.status (401).json ({error: "Usuario no autenticado"});
//         }

//         const userId = req.session.usuario._id;

//         const productos = await MongoProduct.find({userId });
//         return res.status (200).json(productos);
//     } catch (error) {
//         return res.status (500).json({error: 'Error al obtener los productos del usuario'});
//     }
// }


import { MongoProduct } from '../models/mongo.models.js';

export async function getProductUsuario(req, res) {
    try {
        if (!req.session.usuario) {
            return res.status(401).json({ error: 'Usuario no autenticado' });
        }

        const userId = req.session.usuario._id;
        const productos = await MongoProduct.find({ userId });
        
        return res.status(200).json(productos);
    } catch (error) {
        return res.status(500).json({ error: 'Error al obtener los productos del usuario' });
    }
}

export async function createProduct(req, res) {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Usuario no autenticado' });
        }
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'No tienes permisos para crear productos' });
        }

        const { name, description, price } = req.body;
        const newProduct = new MongoProduct({ name, description, price, userId: req.user._id });

        await newProduct.save();
        return res.status(201).json({ message: 'Producto creado exitosamente', product: newProduct });
    } catch (error) {
        return res.status(500).json({ error: 'Error al crear el producto' });
    }
}

export async function getAllProducts(req, res) {
    try {
        const limit = parseInt(req.query.limit);
        const products = await MongoProduct.find().lean();

        if (!limit || isNaN(limit)) {
            res.json(products);
        } else {
            res.json(products.slice(0, limit));
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function getProductById(req, res) {
    try {
        const productId = req.params.pid;
        const product = await MongoProduct.findById(productId).lean();
        
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.json(product);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
}

export async function updateProduct(req, res) {
    try {
        const productId = req.params.pid;
        const updatedProduct = await MongoProduct.findByIdAndUpdate(productId, req.body, { new: true }).lean();

        if (!updatedProduct) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.status(200).json({ message: 'Producto actualizado exitosamente', product: updatedProduct });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export async function deleteProduct(req, res) {
    try {
        const productId = req.params.pid;
        const deletedProduct = await MongoProduct.findByIdAndDelete(productId).lean();

        if (!deletedProduct) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.status(200).json({ message: 'Producto eliminado exitosamente' });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
}

