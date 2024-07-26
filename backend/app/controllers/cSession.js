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

        // Generamos el token.
        const token = jwt.sign(
            {
                Nombre: user.Nombre,
                Contrasena: user.Contrasena,
                Rol: user.Rol
            }, 
            config.secretJwtKey, 
            {
                expiresIn: '20m',
            }
        );

        // Guardamos el token en una cookie y enviamos la información del usuario logueado.
        res.cookie('access_token', token, {
            httpOnly: true, // Asegura que la cookie no sea accesible desde JavaScript en el navegador
            // secure: true, // Asegura que la cookie solo se envíe a través de HTTPS
            // secure: process.env.NODE_ENV === 'production', // Asegura que la cookie se pueda probar en producción.
            sameSite: 'strict', // Previene que la cookie sea enviada en solicitudes cross-site
            maxAge: 20 * 60 * 1000 // 20 minutos
        });
        
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
    res.clearCookie('access_token');
    res.json({ message: 'Logout Successful.'});
};

const session = { login, register, logout };

export default session;