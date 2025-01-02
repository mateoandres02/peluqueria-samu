import jwt from 'jsonwebtoken';
import { config } from "../config/config.js";

const verifyToken = async (req, res, next) => {
    let token = null;

    // 1. Intentar obtener el token del encabezado Authorization
    if (req.headers.authorization) {
        token = req.headers.authorization || req.headers['authorization']?.split(' ')[1];
        console.log('header', token)
    }
    
    // 2. Intentar obtener el token de las cookies
    if (!token && req.cookies.token) {
        token = req.cookies.token;
        console.log('cookies', token)
    }
    
    // 3. Intentar obtener el token desde el cuerpo (si localStorage lo envía explícitamente)
    if (!token && req.body?.accessToken) {
        token = req.body.accessToken;
        console.log('localstorage', token)
    }

    if (!token) {
        return res.status(401).json({
            message: 'Acceso denegado. Token no proporcionado.'
        });
    }

    try {
        jwt.verify(token, config.secretJwtKey, (err, user) => {
            if (err) {
                return res.status(403).json({ message: 'Token inválido o expirado.' });
            }
            req.user = user;
            next();
        });
    } catch (error) {
        res.clearCookie("token");
    }

};

export { verifyToken };