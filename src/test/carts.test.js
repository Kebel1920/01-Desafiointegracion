import request from 'supertest';
import app from '../../app'; // Asumiendo que tu app está en app.js
import { expect } from 'chai';
import sinon from 'sinon';
import CartManager from '../cart.manager.js';

describe('Cart Router', () => {
  let token;
  let cartManagerStub;

  beforeEach(async () => {
    // Crear un token de prueba
    token = 'Bearer some-test-token';

    // Stub para CartManager
    cartManagerStub = sinon.stub(new CartManager());

    // Ejemplo de stub para obtener un carrito existente
    cartManagerStub.getCartById.returns({
      _id: 'some-cart-id',
      products: [{ productId: 'some-product-id', quantity: 1 }],
      totalPrice: 100,
    });

    // Ejemplo de stub para agregar un producto al carrito
    cartManagerStub.addProductToCart.returns({
      _id: 'some-cart-id',
      products: [{ productId: 'some-product-id', quantity: 2 }],
      totalPrice: 150,
    });

    // Ejemplo de stub para manejar un carrito vacío
    cartManagerStub.getCartById.returns({
      _id: 'some-empty-cart-id',
      products: [],
      totalPrice: 0,
    });
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should create a new cart', async () => {
    const res = await request(app)
     .post('/cart')
     .set('Authorization', token)
     .send({});

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('_id').that.is.a('string');
    expect(res.body).to.have.property('products').that.is.an('array').that.is.empty;
    expect(res.body).to.have.property('totalPrice').that.is.a('number').that.equals(0);
  });

  it('should add a product to a cart', async () => {
    const productId = 'some-product-id';

    const res = await request(app)
     .post(`/cart/products/${productId}`)
     .set('Authorization', token)
     .send({ quantity: 1 });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('_id', 'some-cart-id');
    expect(res.body).to.have.property('products').that.is.an('array').with.lengthOf(1);
    expect(res.body.products[0]).to.have.property('productId', productId);
    expect(res.body).to.have.property('totalPrice').that.is.a('number').that.equals(100);
  });

  it('should handle error when adding product with invalid ID to cart', async () => {
    const invalidProductId = 'invalid-product-id';

    const res = await request(app)
     .post(`/cart/products/${invalidProductId}`)
     .set('Authorization', token)
     .send({ quantity: 1 });

    expect(res.status).to.equal(400); // Example: Handle validation errors properly
    expect(res.body).to.have.property('error').that.includes('Invalid product ID');
  });

  it('should handle error when checking out an empty cart', async () => {
    const res = await request(app)
     .post('/cart/checkout')
     .set('Authorization', token)
     .send({});

    expect(res.status).to.equal(400); // Example: Handle checkout of empty cart properly
    expect(res.body).to.have.property('error').that.includes('Cart is empty');
  });
});
