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
                expiresIn: '1h',
            }
        );

        res.cookie('token_access', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            path: '/',
            maxAge: 1000 * 60 * 60 * 1
        });
            // maxAge: 1000 * 60 * 5
            // maxAge: 1000 * 60 * 60 * 10 // 10 horas de duración para la cookie
         });
        
        res.send({ user, token })
        //res.status(200).json({ user, token });
    } catch (error) {
        res.status(401).send(error.message);
        //res.status(401).json(error.message);
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
    res.clearCookie('token_access', {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        path: '/',
    });
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