import { Router } from "express";
import { productDao } from "../dao.factory.js";
import { auth } from "../middlewares/auth.js";
import { SECRET } from "../dao.factory.js";
import jwt from 'jsonwebtoken'

export const router=Router()

router.get ('/',async (req,res)=>{
    try {
        const products = await productDao.getProduct();
        res.status(200).render('home',{login:req.session.usuario,products})
    }catch (error) {
        res.status (500).json({error: error.message});
    }

});

router.get('/record',(req,res)=>{

    let {error, mensaje} = req.query

    res.status(200).render('record', {error, mensaje, login:req.session.usuario})
})

router.get('/login',(req,res)=>{
    res.status(200).render('login', {login:req.session.usuario})
})

router.get('/profile', auth, (req,res)=>{

    let usuario=req.session.usuario

    res.status(200).render('profile', {usuario,login:req.session.usuario});
});

router.get ('/recover01',(req, res)=>{
    let { mensaje } = req.query;
    res.status(200).render('recover01',{mensaje});
});

router.get ('/recover02', (req, res)=>{
    const {token} = req.query;
    try {
        jwt.verify(token,SECRET);
        res.render ('recover02',{token});
    } catch (error) {
        res.redirect('/recover01?mensaje=Token inválido o expirado. Por favor, solicite un nuevo enlace.');
        // res.status(400).send('Token invalido o expirado');
        
    }
    // res.status(200).render('recover02',{token});
});



// router.get('/recover02', (req, res) => {
//     const { token } = req.query;

//     try {
//         jwt.verify(token, SECRET);
//         // Renderizar la plantilla 'recover02.handlebars'
//         res.render('recover02', { token });
//     } catch (error) {
//         res.status(400).send('Token inválido o expirado');
//     }
// });



