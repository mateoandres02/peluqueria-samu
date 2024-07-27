import jwt from 'jsonwebtoken';
import { config } from "../config/config.js";

const verifyToken = (req, res, next) => {

    const token = req.cookies.access_token;

    if (!token) {
        return res.redirect('/login.html');
    }
    
    jwt.verify(token, config.secretJwtKey, (err, user) => {
        if (err) {
            return res.redirect('/login.html');
        }
        req.user = user;
        next();
    });

};

export { verifyToken };
