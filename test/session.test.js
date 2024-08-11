import request from 'supertest';
import app from '../../app'; // Asumiendo que tu app está en app.js
import { expect } from 'chai';
import sinon from 'sinon';
import { UsuariosManagerMongo } from '../usuariosManagerMONGO.js';
import { usuariosModel } from '../src/dao/models/usuarios.model.js';
import { creaHash, validaPassword, SECRET } from '../dao.factory.js';
import jwt from 'jsonwebtoken';
import sendEmail from '../../nodemailer/nodemailer.js';

describe('User Router', () => {
  let usuariosManagerStub;

  beforeEach(() => {
    usuariosManagerStub = sinon.stub(new UsuariosManagerMongo());

    // Stubbing methods
    sinon.stub(usuariosManagerStub, 'getBy').callsFake(async (query) => {
      if (query.email === 'existing@example.com') {
        return { _id: 'existing-user-id', nombre: 'Existing User', email: 'existing@example.com', password: creaHash('password') };
      }
      return null;
    });

    sinon.stub(usuariosManagerStub, 'create').callsFake(async (data) => {
      return { _id: 'new-user-id', ...data };
    });

    sinon.stub(usuariosModel, 'findOne').callsFake(async (query) => {
      if (query.email === 'existing@example.com') {
        return { _id: 'existing-user-id', nombre: 'Existing User', email: 'existing@example.com', password: creaHash('password') };
      }
      return null;
    });

    sinon.stub(usuariosModel, 'findById').callsFake(async (id) => {
      if (id === 'existing-user-id') {
        return { _id: 'existing-user-id', nombre: 'Existing User', email: 'existing@example.com', password: creaHash('password') };
      }
      return null;
    });

    sinon.stub(sendEmail).callsFake(async () => {
      return true;
    });
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should register a new user', async () => {
    const newUser = { nombre: 'New User', email: 'new@example.com', password: 'password' };

    const res = await request(app)
     .post('/users/record')
     .send(newUser);

    expect(res.status).to.equal(302); // Redirection status
    expect(res.header.location).to.include('/record?mensaje=Registro exitoso para New User');
  });

  it('should not register a user with existing email', async () => {
    const existingUser = { nombre: 'Existing User', email: 'existing@example.com', password: 'password' };

    const res = await request(app)
     .post('/users/record')
     .send(existingUser);

    expect(res.status).to.equal(302); // Redirection status
    expect(res.header.location).to.include('/record?error=Ya existen usuarios con email existing@example.com');
  });

  it('should login a user with valid credentials', async () => {
    const loginUser = { email: 'existing@example.com', password: 'password' };

    const res = await request(app)
     .post('/users/login')
     .send(loginUser);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('message', 'Login correcto');
    expect(res.body).to.have.property('usuario').that.includes({ nombre: 'Existing User', email: 'existing@example.com' });
  });

  it('should not login a user with invalid credentials', async () => {
    const loginUser = { email: 'existing@example.com', password: 'wrongpassword' };

    const res = await request(app)
     .post('/users/login')
     .send(loginUser);

    expect(res.status).to.equal(401);
    expect(res.body).to.have.property('error', 'Credenciales incorrectas');
  });

  it('should send a password recovery email', async () => {
    const email = { email: 'existing@example.com' };

    const res = await request(app)
     .post('/users/recover01')
     .send(email);

    expect(res.status).to.equal(302); // Redirection status
    expect(res.header.location).to.include('/recover01?mensaje=Recibira un email en breve. Siga los pasos...');
  });

  it('should not send a password recovery email for non-existent user', async () => {
    const email = { email: 'nonexistent@example.com' };

    const res = await request(app)
     .post('/users/recover01')
     .send(email);

    expect(res.status).to.equal(400);
    expect(res.body).to.have.property('error', 'No existe usuario con ese email.');
  });

  it('should reset password with valid token', async () => {
    const resetData = { token: jwt.sign({ id: 'existing-user-id' }, SECRET, { expiresIn: '1h' }), newPassword: 'newpassword', newPassword2: 'newpassword' };

    const res = await request(app)
     .post('/users/recover03')
     .send(resetData);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('message', 'Contraseña actualizada con éxito');
  });

  it('should not reset password with invalid token', async () => {
    const resetData = { token: 'invalid-token', newPassword: 'newpassword', newPassword2: 'newpassword' };

    const res = await request(app)
     .post('/users/recover03')
     .send(resetData);

    expect(res.status).to.equal(500);
    expect(res.body).to.have.property('error', 'Error inesperado en el servidor - Intente más tarde, o contacte a su administrador');
  });
});
