// import jwt from 'jsonwebtoken';
// import { config } from "../config/config.js";

// const verifyToken = async (req, res, next) => {

//     // Obtenemos el token desde las cookies.
//     const accessToken = await req.cookies.access_token;
//     const refreshToken = await req.cookies.refresh_token;

//     if (!accessToken) {
//         if (!refreshToken) {
//             return res.status(401).json({
//                 message: 'Acceso denegado. Token no proporcionado.'
//             });
//         };

//         // Intentamos usar el refresh token para generar un nuevo access token.
//         try {
//             const decoded = jwt.verify(refreshToken, config.refreshTokenKey);

//             const newAccessToken = jwt.sign(
//                 { Id: decoded.Id },
//                 config.secretJwtKey,
//                 { expiresIn: config.accessTokenDuration }
//             );

//             res.cookie('access_token', newAccessToken, {
//                 httpOnly: true,
//                 secure: true,
//                 sameSite: 'None',
//                 path: '/',
//                 maxAge: 15 * 60 * 1000
//             });

//             req.user = decoded;
//             return next();
//         } catch (error) {
//             return res.status(401).json({
//                 message: 'Sesión expirada. Por favor, inicie sesión nuevamente.'
//             });
//         }
//     };

//     try {
//         const decoded = jwt.verify(accessToken, config.secretJwtKey);
//         req.user = decoded;
//         return next();
//     } catch (error) {
//         return res.status(401).json({
//             message: 'Acceso denegado. Token inválido.'
//         });
//     }

// };

// export { verifyToken };


/** **/


import jwt from 'jsonwebtoken';
import { config } from "../config/config.js";

const verifyToken = async (req, res, next) => {

    // Obtenemos el token desde las cookies.
    const token = await req.cookies.access_token;

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

};

export { verifyToken };

/** **/

