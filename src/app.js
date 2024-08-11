// import express from "express";
// import handlebars from 'express-handlebars'
// import session from "express-session";
// import { auth } from "./dao/middlewares/auth.js";
// import __dirname, {SECRET} from "./dao/dao.factory.js";
// import path from 'path';
// import dotenv from "dotenv";
// import passport from "passport";
// import { inicializaPassport } from "./dao/config/passport.config.js";
// import { initPassport } from "./dao/config/passport.github.config.js";



// import { router as productRouter} from "./dao/router/product.Router.js";
// import {router as vistasRouter} from "./dao/router/vistas.router.js";
// import { router as sessionsRouter } from "./dao/router/session.router.js";
// import { router as githubRouter } from "./dao/router/github.router.js";
// import { router as cartRouter } from "./dao/cart/router/cart.router.js";
// import { router as usersRouter } from "./dao/router/users.router.js";
// import { router as paymentRouter } from "./payments/payment.router.js";

// dotenv.config();
// const app = express()


// // Middleware para manejar el cuerpo de las solicitudes
// app.use(express.json());
// app.use (express.urlencoded ({extended:true}))

// app.use(session({
//     secret: SECRET,
//     resave: true, saveUninitialized: true,
   
// }))

// // 2) inicializo passport y sus configuraciones en el app.js
// inicializaPassport()
// app.use (passport.initialize())
// app.use (passport.session ())


// // Router github
// initPassport()
// app.use (passport.initialize())
// app.use (passport.session ())


// // app.use(express.static('public'))
// app.use(express.static(path.join(__dirname, 'public')));

// //  para usar Handlebars
// app.engine('handlebars',handlebars.engine())
// app.set('view engine', 'handlebars');
// app.set('views', path.join(__dirname, '/views'));


// // LLamar los router
// app.use ("/api/sessions",sessionsRouter)
// app.use ('/',vistasRouter)
// app.use ('/api/products', productRouter)
// app.use ('/api/cart',cartRouter)
// app.use ("/api/sessions", githubRouter)
// app.use(express.static('public'));
// app.use(express.static('public'));
// app.use('/api/users', usersRouter);
// app.use((req, res, next) => {
//     res.header('Content-Type', 'text/css');
//     next();
// });
// app.use(express.urlencoded({extended:true}));

// app.use 

// // PaymentRouter
// app.use ('/api/payments', paymentRouter);



// app.get('/',(req,res)=>{

//     let mensaje = "Bienvenido"
//     if(req.session.contador){
//     req.session.contador ++;
//     mensaje+=`.Visitas a esta ruta: ${req.session.contador}`;
//     } else {
//         req.session.contador=1
//     }
//     res.setHeader('Content-Type','text/plain');
//     res.setHeader; (200). send(mensaje);
// });


// app.get('/datos', auth, (req,res)=>{
//     res.setHeader('Content-Type','application/json');
//     res.status(200).json({datos:"ruta datos..."});
// });

// // Ruta para mostrar la vista del carrito
// app.get('/cart', (req, res) => {
//     res.render('cart');
// });

// // Ruta para mostrar la vista de productos
// app.get('/products', async (req, res) => {
//     const products = await MongoProduct.find();
//     res.render('products', { productos: products });
// });



// // Puerto en el que escucha el servidor
// const PORT = process.env.PORT || 8080;
// app.listen(PORT, () => {
//     console.log(`Servidor Express iniciado en el puerto ${PORT}`);
// });



// Importaciones necesarias
import express from 'express';
import handlebars from 'express-handlebars';
import session from 'express-session';
import { auth } from './dao/middlewares/auth.js';
import __dirname, { SECRET } from './dao/dao.factory.js';
import path from 'path';
import dotenv from 'dotenv';
import passport from 'passport';
import { inicializaPassport } from './dao/config/passport.config.js';
import { initPassport } from './dao/config/passport.github.config.js';

import { router as productRouter } from './dao/router/product.Router.js';
import { router as vistasRouter } from './dao/router/vistas.router.js';
import { router as sessionsRouter } from './dao/router/session.router.js';
import { router as githubRouter } from './dao/router/github.router.js';
import { router as cartRouter } from './dao/cart/router/cart.router.js';
import { router as usersRouter } from './dao/router/users.router.js';
import { router as paymentRouter } from './router/payments/payment.router.js';

dotenv.config();
const app = express();

// Middleware para manejar el cuerpo de las solicitudes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: SECRET,
    resave: true,
    saveUninitialized: true,
}));

// Inicialización de Passport
inicializaPassport();
app.use(passport.initialize());
app.use(passport.session());

// Inicialización de Passport para Github
initPassport();
app.use(passport.initialize());
app.use(passport.session());

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Configurar el motor de plantillas Handlebars
app.engine('handlebars', handlebars.engine({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, '/views/layouts'),
    partialsDir: path.join(__dirname, '/views/partials'),
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '/views'));

// Llamar a los routers
app.use('/api/sessions', sessionsRouter);
app.use('/', vistasRouter);
app.use('/api/products', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/sessions', githubRouter);
app.use('/api/users', usersRouter);

// Rutas adicionales
app.use('/api/payments', paymentRouter);

// Ruta principal
app.get('/', (req, res) => {
    let mensaje = "Bienvenido";
    if (req.session.contador) {
        req.session.contador++;
        mensaje += `. Visitas a esta ruta: ${req.session.contador}`;
    } else {
        req.session.contador = 1;
    }
    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send(mensaje);
});

// Ruta de datos protegida
app.get('/datos', auth, (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ datos: 'ruta datos...' });
});

// Ruta para mostrar la vista del carrito
app.get('/cart', (req, res) => {
    res.render('cart', { title: 'Carrito' });
});

// Ruta para mostrar la vista de productos
app.get('/products', async (req, res) => {
    const products = await MongoProduct.find();
    res.render('products', { productos: products, title: 'Productos' });
});

// Ruta para mostrar la vista de pago
app.get('/payment', (req, res) => {
    res.render('payment', { title: 'Payment', STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY });
});

// Puerto en el que escucha el servidor
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Servidor Express iniciado en el puerto ${PORT}`);
});
