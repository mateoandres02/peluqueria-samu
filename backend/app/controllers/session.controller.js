import { UserRepository } from "../session/user-repository.js";

const login = async (req, res) => {

    const { Nombre, Contrasena } = req.body;

    try {
        const user = await UserRepository.login({ Nombre, Contrasena });
        res.send({ user });
    } catch (error) {
        res.status(401).send(error.message);
    };

}

const register = async (req, res) => {

    const { Nombre, Contrasena } = req.body;

    try {
        const newUser = await UserRepository.create({ Nombre, Contrasena });
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    };

}

const logout = (req, res) => {
    res.send({ message: "Logged out successfully" });
}

const routeProtected = (req, res) => {
    res.send({ message: "Hacer la ruta protegida" });
}

const session = { login, register, logout, routeProtected };

export default session;