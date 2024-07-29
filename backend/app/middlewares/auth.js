import jwt from 'jsonwebtoken';
import { config } from "../config/config.js";

const verifyToken = (req, res, next) => {

    // Obtenemos el token desde las cookies.
    const token = req.cookies.access_token;

    if (!token) {
        res.status(401).json({
            message: 'Acceso denegado.'
        });
    };
    
    jwt.verify(token, config.secretJwtKey, (err, user) => {
        if (err) {
            res.status(401).json({
                message: 'Toket inválido.'
            })
        }
        req.user = user;
        next();
    });

};


export { verifyToken };
