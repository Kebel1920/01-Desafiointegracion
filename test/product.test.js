import request from 'supertest';
import app from '../../app'; // Asumiendo que tu app está en app.js
import { expect } from 'chai';
import sinon from 'sinon';
import { productDao } from '../dao.factory.js';

describe('Product Router', () => {
  let token;

  beforeEach(async () => {
    // Crear un token de prueba si es necesario
    token = 'Bearer some-test-token';

    // Stub para productDao si es necesario
    sinon.stub(productDao, 'getProduct').returns([
      { _id: 'product1', name: 'Product 1', price: 10 },
      { _id: 'product2', name: 'Product 2', price: 20 },
    ]);

    sinon.stub(productDao, 'getProductById').returns({ _id: 'product1', name: 'Product 1', price: 10 });

    sinon.stub(productDao, 'addProduct').returns({ _id: 'new-product-id', name: 'New Product', price: 30 });

    sinon.stub(productDao, 'updateProduct').returns();

    sinon.stub(productDao, 'deleteProduct').returns();
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should get all products with limit', async () => {
    const limit = 1;

    const res = await request(app)
     .get('/products')
     .query({ limit })
     .set('Authorization', token);

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array').that.has.lengthOf(limit);
    expect(res.body[0]).to.have.property('_id', 'product1');
  });

  it('should get a product by ID', async () => {
    const productId = 'product1';

    const res = await request(app)
     .get(`/products/${productId}`)
     .set('Authorization', token);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('_id', productId);
    expect(res.body).to.have.property('name', 'Product 1');
  });

  it('should add a new product', async () => {
    const newProductData = { name: 'New Product', price: 30 };

    const res = await request(app)
     .post('/products')
     .set('Authorization', token)
     .send(newProductData);

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('_id', 'new-product-id');
    expect(res.body).to.have.property('name', 'New Product');
  });

  it('should update a product by ID', async () => {
    const productId = 'product1';
    const updatedProductData = { name: 'Updated Product', price: 15 };

    const res = await request(app)
     .put(`/products/${productId}`)
     .set('Authorization', token)
     .send(updatedProductData);

    expect(res.status).to.equal(200);
    expect(res.text).to.equal('Producto actualizado exitosamente');
  });

  it('should delete a product by ID', async () => {
    const productId = 'product1';

    const res = await request(app)
     .delete(`/products/${productId}`)
     .set('Authorization', token);

    expect(res.status).to.equal(200);
    expect(res.text).to.equal('Producto eliminado exitosamente');
  });
});
