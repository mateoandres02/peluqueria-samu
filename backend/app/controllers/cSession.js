// Importamos el contrato.
import { UserRepository } from "../models/mUserRepository.js";

// Importamos palabra secreta necesaria para generar la encriptación.
import { config } from "../config/config.js";

// Importamos jsonwebtoken.
import jwt from "jsonwebtoken";

const login = async (req, res) => {

    // Recibimos la información proveniente de la request y la destructuramos por cada campo.
    const { Nombre, Contrasena, Rol } = req.body;

    try {
        
        // Logueamos el usuario y lo validamos.
        const user = await UserRepository.login({ Nombre, Contrasena, Rol });

        // Generamos el token de acceso.
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

        // Guardamos el token de acceso en una cookie.
        res.cookie('access_token', token, {
            httpOnly: true, // Solo accesible por el servidor
            secure: true, // Asegúrate de que solo se envíe sobre HTTPS
            sameSite: 'None', // Asegúrate de que se envíe en solicitudes cruzadas
            // domain: 'https://peluqueria-invasion-front.vercel.app', // Dominio del backend
            path: '/', // Asegúrate de que la cookie esté disponible para todas las rutas
            maxAge: 1000 * 60 * 60 * 10 
        });
        
        // enviamos la información del usuario logueado y la información de los tokens
        res.send({ user, token });

    } catch (error) {

        // Manejamos posible error.
        res.status(401).send(error.message);

    };

};

const register = async (req, res) => {

    // Recibimos la información proveniente de la request.
    const { Nombre, Contrasena, Rol } = req.body;

    try {
        
        // Registramos el usuario y manejamos errores.
        const newUser = await UserRepository.create({ Nombre, Contrasena, Rol });

        // Si newUser guarda algo, entonces lo mostramos en json.
        res.status(201).json(newUser);

    } catch (error) {

        // Manejamos posible error.
        res.status(400).json({ error: error.message });

    };

};

const logout = (req, res) => {
    // Limpiamos el token de las cookies.
    // res.clearCookie('access_token');
    res.clearCookie('access_token', {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        path: '/',
        // domain: 'tu-dominio.com' // Igual que antes, no lo incluyas si no es necesario
    });
    res.json({ message: 'Logout Successful.'});
};

const session = { login, register, logout };

export default session;