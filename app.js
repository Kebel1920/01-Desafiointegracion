import express from "express";
import handlebars from 'express-handlebars'

import { productDao } from "./dao/dao.factory.js";


const app = express();


app.engine('handlebars',handlebars.engine())
app.set ('view engine','handlebars');
//app.set ('views','/views')

// Middleware para manejar el cuerpo de las solicitudes
app.use(express.json());

// Endpoint para obtener todos los productos
app.get('/api/products', (req, res) => {
    try {
        const limit = parseInt(req.query.limit);
        const products = productDao.getProducts();
        
        if (!limit || isNaN(limit)) {
            res.json(products);
        } else {
            res.json(products.slice(0, limit));
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint para agregar un nuevo producto
app.post('/api/products', (req, res) => {
    try {
        console.log(req.body);
        const newProduct = productDao.addProduct(req.body);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// para obtener un produto por ID
app.get('/api/products/:pid',(req, res)=>{
    try {
        const productId = req.params.pid;
        const product = productDao.getProductById(productId);
        res.json (product);
    }catch (error) {
        res.status(404).json({error:error.message});
    }
});
//para actualizar un producto por su ID
app.put('/api/products/:pid', (req, res) => {
    try {
        const productId = req.params.pid;
        productDao.updateProduct(productId, req.body);
        res.status(200).send ('Producto actualizado exitosamente');
    } catch (error) {
        res.status(400).json({error: error.message});
    }
});
// Para eliminar in productopor ID
app.delete('/api/products/:pid', (req, res) => {
    try {
        const productId = req.params.pid;
        productDao.deleteProduct (productId);
        res.status (200).send('Producto eliminado exitosamente');
    } catch (error) {
        res.status(404).json({error: error.message});
    }
});
// Puerto en el que escucha el servidor
const PORT =8080;
app.listen(PORT, () => {
    console.log(`Servidor Express iniciado en el puerto ${PORT}`);
});
