import express from "express";
import handlebars from 'express-handlebars'
import session from "express-session";
import { auth } from "./dao/middlewares/auth.js";
import __dirname, {SECRET} from "./dao/dao.factory.js";
import path from 'path';
import dotenv from "dotenv";
import passport from "passport";
import { inicializaPassport } from "./dao/config/passport.config.js";
import { initPassport } from "./dao/config/passport.github.config.js";


import { router as productRouter} from "./dao/router/product.Router.js";
import {router as vistasRouter} from "./dao/router/vistas.router.js";
import { router as sessionsRouter } from "./dao/router/session.router.js";
import { router as githubRouter } from "./dao/router/github.router.js";
import { router as cartRouter } from "./dao/cart/router/cart.router.js";


dotenv.config();
const app = express()


// Middleware para manejar el cuerpo de las solicitudes
app.use(express.json());
app.use (express.urlencoded ({extended:true}))

app.use(session({
    secret: SECRET,
    resave: true, saveUninitialized: true,
   
}))

// 2) inicializo passport y sus configuraciones en el app.js
inicializaPassport()
app.use (passport.initialize())
app.use (passport.session ())


// Router github
initPassport()
app.use (passport.initialize())
app.use (passport.session ())


// app.use(express.static('public'))
app.use(express.static(path.join(__dirname, 'public')));

//  para usar Handlebars
app.engine('handlebars',handlebars.engine())
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '/views'));


// LLamar los router
app.use ("/api/sessions",sessionsRouter)
app.use ('/',vistasRouter)
app.use ('/api/products', productRouter)
app.use ('/api/cart',cartRouter)
app.use ("/api/sessions", githubRouter)
app.use(express.static('public'));
app.use(express.static('public'));
app.use((req, res, next) => {
    res.header('Content-Type', 'text/css');
    next();
});
app.use(express.urlencoded({extended:true}));



app.get('/',(req,res)=>{

    let mensaje = "Bienvenido"
    if(req.session.contador){
    req.session.contador ++;
    mensaje+=`.Visitas a esta ruta: ${req.session.contador}`;
    } else {
        req.session.contador=1
    }
    res.setHeader('Content-Type','text/plain');
    res.setHeader; (200). send(mensaje);
});


app.get('/datos', auth, (req,res)=>{
    res.setHeader('Content-Type','application/json');
    res.status(200).json({datos:"ruta datos..."});
});



// Puerto en el que escucha el servidor
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Servidor Express iniciado en el puerto ${PORT}`);
});
