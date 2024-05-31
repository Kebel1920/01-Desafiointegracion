import { Router } from 'express';
import { productDao } from '../dao.factory.js';
import { auth } from '../middlewares/auth.js';
import { getProductUsuario } from '../Controller/products.controller.js';

export const router=Router()

router.get ('/', getProductUsuario);

// Endpoint para obtener todos los productos
router.get('/', auth, async (req, res) => {
    try {
        const limit = parseInt(req.query.limit);
        const products = await productDao.getProduct();
        console.log(products)
        if (!limit || isNaN(limit)) {
            res.json(products);
        } else {
            res.json(products.slice(0, limit));
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// para obtener un produto por ID
router.get('/',async (req, res)=>{
    try {
        const productId = req.params.pid;
        const product = await productDao.getProductById(productId);
        res.json (product);
    }catch (error) {
        res.status(404).json({error:error.message});
    }
});

// Endpoint para agregar un nuevo producto
router.post('/', async (req, res) => {
    try {
        console.log(req.body);
        const newProduct = await productDao.addProduct(req.body);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

//para actualizar un producto por su ID
router.put('/', async (req, res) => {
    try {
        const productId = req.params.pid;
        await productDao.updateProduct(productId, req.body);
        res.status(200).send ('Producto actualizado exitosamente');
    } catch (error) {
        res.status(400).json({error: error.message});
    }
});
// Para eliminar in productopor ID
router.delete('/', async (req, res) => {
    try {
        const productId = req.params.pid;
       await productDao.deleteProduct(productId);
        res.status (200).send('Producto eliminado exitosamente');
    } catch (error) {
        res.status(404).json({error: error.message});
    }
});






