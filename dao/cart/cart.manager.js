import {MongoCart,MongoProduct } from '../models/mongo.models.js';
import sendPurchaseEmail from '../../nodemailer/nodemailer.js';
import Ticket from './models/model.ticket.js';

export default class CartManager {
  async createCart() {
    const cart = new MongoCart({ products: [] });
    return await cart.save();
  }

  async getCartById(cartId) {
    return await MongoCart.findById(cartId).populate('products');
  }

  async addToCart(cartId, productId) {
    const cart = await MongoCart.findById(cartId);
    const product = await MongoProduct.findById(productId);

    if (cart && product) {
      cart.products.push(product);
      return await cart.save();
    } else {
      throw new Error('Cart or Product not found');
    }
  }

  async removeFromCart(cartId, productId){
    const cart = await MongoCart.findById(cartId);

    if (cart) {
      cart.products = cart.products.filter(product => product._id.toString() !== productId);
      return await cart.save();
    } else {
      throw new Error('Cart not found');
    }
  }
}



  async function checkout (cartId, userEmail)
  {
    const cart = await MongoCart.findById(cart).populate('products');
    if (!cart) throw new Error('Cart not found');

    const products = cart.products.map(product => ({
      name: product.name,
      price: product.price,
      quantity: product.quantity,
    }));


 // Generar contenido HTML del ticket
 const htmlContent = `
 <h1>Thank you for your purchase!</h1>
 <h2>Order Summary:</h2>
 <ul>
  ${products.map(product => `<li>${product.name} - $${product.price} x ${product.quantity}</li>`).join('')}
 </ul>
 <p>Total: $${products.reduce((acc, product) => acc + product.price * product.quantity, 0)}</p>
 `;

 // Enviar el ticket de compra por correo
 await sendPurchaseEmail(userEmail, 'Your Purchase Ticket', htmlContent);

 // Limpiar el carrito después de la compra
 cart.products = [];
 await cart.save();

 return cart;
}


async function purchaseCart(cartId, userEmail) {
  const cart = await MongoCart.findById(cartId).populate('products');
  if (!cart) throw new Error('Cart not found');

  const productsToPurchase = [];
  const productsNotProcessed = [];

  let totalAmount = 0;

  for (const product of cart.products) {
    const productInDb = await MongoProduct.findById(product._id);
    if (productInDb.stock >= product.quantity) {
      productInDb.stock -= product.quantity;
      await productInDb.save();
      productsToPurchase.push(product);
      totalAmount += product.price * product.quantity;
    } else {
      productsNotProcessed.push(product._id);
    }
  }

  if (productsToPurchase.length > 0) {
    const htmlContent = `
      <h1>Thank you for your purchase!</h1>
      <h2>Order Summary:</h2>
      <ul>
        ${productsToPurchase.map(product => `<li>${product.name} - $${product.price} x ${product.quantity}</li>`).join('')}
      </ul>
      <p>Total: $${totalAmount}</p>
    `;

    await sendPurchaseEmail(userEmail, 'Your Purchase Ticket', htmlContent);

    // Crear el ticket
    const ticket = new Ticket({
      amount: totalAmount,
      purchaser: userEmail
    });
    await ticket.save();
  }

  cart.products = cart.products.filter(product => productsNotProcessed.includes(product._id));
  await cart.save();

  return {
    purchasedProducts: productsToPurchase,
    notProcessedProducts: productsNotProcessed,
  };
}
