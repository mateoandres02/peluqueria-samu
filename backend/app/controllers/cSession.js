// import { UserRepository } from "../models/mUserRepository.js";
// import { config } from "../config/config.js";
// import jwt from "jsonwebtoken";

// const login = async (req, res) => {

//     const { Nombre, Contrasena, Rol } = req.body;

//     try {
//         const user = await UserRepository.login({ Nombre, Contrasena, Rol });

//         // Token de acceso
//         const accessToken = jwt.sign(
//             {
//                 Id: user.Id,
//                 Nombre: user.Nombre,
//                 Rol: user.Rol
//             }, 
//             config.secretJwtKey, 
//             { expiresIn: config.accessTokenDuration }
//         );

//         // Token de refresco
//         const refreshToken = jwt.sign(
//             {
//                 Id: user.Id
//             }, 
//             config.refreshTokenKey, 
//             { expiresIn: config.refreshTokenDuration }
//         );

//         res.cookie('access_token', accessToken, {
//             httpOnly: true, // Solo accesible por el servidor
//             secure: true, // Solo envío sobre HTTPS
//             sameSite: 'None', // Solicitudes cruzadas
//             path: '/', // Cookie esté disponible para todas las rutas
//             maxAge: 15 * 60 * 1000 // 15 minutos
//         });

//         res.cookie('refresh_token', refreshToken, {
//             httpOnly: true,
//             secure: true,
//             sameSite: 'None',
//             path: '/',
//             maxAge: 24 * 60 * 60 * 1000 // 24 horas
//         });
        
//         res.send({ user, accessToken });
//     } catch (error) {
//         res.status(401).send(error.message);
//     };

// };

// const register = async (req, res) => {

//     const { Nombre, Contrasena, Rol } = req.body;

//     try {
//         const newUser = await UserRepository.create({ Nombre, Contrasena, Rol });
//         res.status(201).json(newUser);
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     };

// };

// const logout = (req, res) => {
//     res.clearCookie('access_token', {
//         httpOnly: true,
//         secure: true,
//         sameSite: 'None',
//         path: '/',
//     });
//     res.clearCookie('refresh_token', {
//         httpOnly: true,
//         secure: true,
//         sameSite: 'None',
//         path: '/',
//     });
//     res.json({ message: 'Logout Successful.'});
// };

// const session = { login, register, logout };

// export default session;


/** **/


import { UserRepository } from "../models/mUserRepository.js";
import { config } from "../config/config.js";
import jwt from "jsonwebtoken";

const login = async (req, res) => {

    const { Nombre, Contrasena, Rol } = req.body;

    try {
        const user = await UserRepository.login({ Nombre, Contrasena, Rol });

        const token = jwt.sign(
            {
                Id: user.Id,
                Nombre: user.Nombre,
                Rol: user.Rol
            }, 
            config.secretJwtKey, 
            {
                expiresIn: '10h',
            }
        );

        res.cookie('access_token', token, {
            httpOnly: true, // Solo accesible por el servidor
            secure: true, // Solo envío sobre HTTPS
            sameSite: 'None', // Solicitudes cruzadas
            path: '/', // Cookie esté disponible para todas las rutas
            domain: 'https://peluqueria-invasion-backend.vercel.app/',
            maxAge: 1000 * 60 * 60 * 10 // 10 horas de duración para la cookie
        });
        
        res.send({ user, token });
    } catch (error) {
        res.status(401).send(error.message);
    };

};

const register = async (req, res) => {

    const { Nombre, Contrasena, Rol } = req.body;

    try {
        const newUser = await UserRepository.create({ Nombre, Contrasena, Rol });
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    };

};

const logout = (req, res) => {
    res.clearCookie('access_token', {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        path: '/',
    });
    res.json({ message: 'Logout Successful.'});
};

const session = { login, register, logout };

export default session;