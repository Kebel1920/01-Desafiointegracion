import jwt from "jsonwebtoken"
import { SECRET } from "../dao/dao.factory.js";
// import * as dotenv from 'dotenv';


// dotenv.config();
// const SECRET= process.env.MONGOPASSWORD

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.sendStatus(401); // Si no hay token, no está autorizado
    }

    jwt.verify(token, SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403); // Token no válido o expirado
        }
        req.user = user; // Guardar el payload del usuario en el request
        next(); // Pasar al siguiente middleware o ruta
    });
};
