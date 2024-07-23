import jwt from 'jsonwebtoken';
import { config } from "../config/config.js";

// const verifyToken = (req, res, next) => {
//     const token = req.cookies.access_token;

//     if (!token) {
//         return res.status(403).send('Access not authorized.');
//     };

//     try {
//         const data = jwt.verify(token, config.secretJwtKey);
//         req.user = data;
//         next();
//     } catch {
//         return res.status(401).send('Access not authorized.');
//     }
// };

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(403).send('Access not authorized.');
    };

    try {
        const data = jwt.verify(token, config.secretJwtKey);
        req.user = data;
        next();
    } catch {
        return res.status(401).send('Access not authorized.');
    }
};

const isAdmin = (req, res, next) => {
    if (req.user.Rol !== 'Admin') {
        return res.status(403).send('Access not authorized for non-admin users.');
    }
    next();
};

export { verifyToken, isAdmin };
