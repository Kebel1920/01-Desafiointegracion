import { Router } from "express";
import { productDao } from "../dao.factory.js";
import { auth } from "../middlewares/auth.js";

export const router=Router()

router.get ('/',async (req,res)=>{
    try {
        const products = await productDao.getProduct();
        res.status(200).render('home',{login:req.session.usuario,products})
    }catch (error) {
        res.status (500).json({error: error.message});
    }

});

router.get('/registro',(req,res)=>{

    let {error, mensaje} = req.query

    res.status(200).render('registro', {error, mensaje, login:req.session.usuario})
})

router.get('/login',(req,res)=>{
    res.status(200).render('login', {login:req.session.usuario})
})

router.get('/profile', auth, (req,res)=>{

    let usuario=req.session.usuario

    res.status(200).render('profile', {usuario,login:req.session.usuario});
});




