import jwt from 'jsonwebtoken';
import { config } from "../config/config.js";

const verifyToken = async (req, res, next) => {
    const token = req.cookies.access_token;

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