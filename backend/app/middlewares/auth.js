import jwt from 'jsonwebtoken';
import { config } from "../config/config.js";

const verifyToken = async (req, res, next) => {

    // Obtenemos el token desde las cookies.
    const token = await req.cookies.access_token;
    console.log("TOKEN", token)

    if (!token) {
        return res.status(401).json({
            message: 'Acceso denegado. Token no proporcionado.'
        });
    };

    jwt.verify(token, config.secretJwtKey, (err, user) => {
        if (err) {
            console.log('err', err);
            return res.status(401).json({
                message: 'Acceso denegado. Token inválido.'
            });
        }
        req.user = user;
        next();
    });

    jwt.verify(token, config.secretJwtKey, (err, user) => {
        if (err) {
            console.error('Error al verificar el token:', err);
            return res.status(403).json({ message: 'Token inválido o expirado.' });
        }
        req.user = user;
        next();
    });

};

//const verifyToken = async (req, res, next) => {
//    const authHeader = req.headers.authorization;
//
//    if (!authHeader || !authHeader.startsWith('Bearer ')) {
//        return res.status(401).json({
//            message: 'Acceso denegado. Token no proporcionado.',
//        });
//    }

//    const token = authHeader.split(' ')[1]; // Obtenemos el token después de 'Bearer'

//    jwt.verify(token, config.secretJwtKey, (err, user) => {
//        if (err) {
//            console.error('Error al verificar el token:', err);
//            return res.status(403).json({ message: 'Token inválido o expirado.' });
//       }
//        req.user = user;
//        next();
//    });
//};


export { verifyToken };