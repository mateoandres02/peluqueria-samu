// Importamos el contrato.
import { UserRepository } from "../session/user-repository.js";

// Importamos palabra secreta necesaria para generar la encriptación.
import { config } from "../config/config.js";

// Importamos jsonwebtoken.
import jwt from "jsonwebtoken";

const login = async (req, res) => {

    // Recibimos la información proveniente de la request.
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
                expiresIn: '1h'
            }
        );

        // Guardamos el token en una cookie y enviamos la información del usuario logueado.
        res.cookie('access_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60
        }).send({ user });

    } catch (error) {
        // Manejamos posible error.
        res.status(401).send(error.message);
    };

}

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

}

const logout = (req, res) => {
    res.clearCookie('access_token').json({ message: 'Logout Successful.'});
}

const routeProtected = (req, res) => {
    res.send('Admin content');
}

const routeNotProtected = (req, res) => {
    res.send('Employee content');
}

const session = { login, register, logout, routeProtected, routeNotProtected };

export default session;