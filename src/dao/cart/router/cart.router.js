import express from 'express';
import CartManager from '../cart.manager.js';
import { auth } from '../../middlewares/auth.js';

// app.use(express.json());
const router = express.Router();
const cartManager = new CartManager();

router.get ('/cart',(req, res)=>{
    res.send('cart router')
})

// Crear un nuevo carrito
router.post('/', auth, async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener carrito por ID
router.get('/:id', auth, async (req, res) => {
  try {
    const cart = await cartManager.getCartById(req.params.id);
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Agregar producto al carrito
router.post('/:id/products', auth, async (req, res) => {
  try {
    const updatedCart = await cartManager.addToCart(req.params.id, req.body.productId);
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar producto del carrito
router.delete('/:id/products/:productId', auth, async (req, res) => {
  try {
    const updatedCart = await cartManager.removeFromCart(req.params.id, req.params.productId);
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Checkout

router.post('/:id/checkout', auth, async (req, res)=> {
    try {
        const cart = await cartManager.getCartById(req.params.id);
        res.status(200).json(cart);
    }catch (error){
        res.status (500).json({error: error.message});
    }
});


// purchase

router.post ('/:cid/purchase',auth, async (req, res)=>{
  try {
    const{cid} = req.params;
    const {email} = req.user;
    const result = await cartManager.purchaseCart(cid, email);
    res.status (200).json(result);
  }catch (error) {
    res.status (500).json({error: error.message});
  }
});

export { router};
