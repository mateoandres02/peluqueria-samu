import jwt from 'jsonwebtoken';
import { config } from "../config/config.js";

const verifyToken = async (req, res, next) => {
    let token = null;

    // 1. Intentar obtener el token del encabezado Authorization
    if (req.headers.authorization) {
        token = req.headers.authorization;
        console.log('header', token)
    }
    
    console.log(req)

    // 2. Intentar obtener el token de las cookies
    if (!token && req.cookies.access_token) {
        token = req.cookies.access_token;
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

    jwt.verify(token, config.secretJwtKey, (err, user) => {
        if (err) {
            console.error('Error al verificar el token:', err);
            return res.status(403).json({ message: 'Token inválido o expirado.' });
        }
        
        req.user = user;
        next();
    });
};

export { verifyToken };