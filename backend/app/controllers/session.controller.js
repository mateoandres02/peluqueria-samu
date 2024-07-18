import { UserRepository } from "../session/user-repository.js";

const login = async (req, res) => {

    // Recibimos la información proveniente de la request.
    const { Nombre, Contrasena } = req.body;

    try {
        // Logueamos el usuario y manejamos errores.
        const user = await UserRepository.login({ Nombre, Contrasena });
        // Si user guarda algo, entonces lo mostramos.
        res.send({ user });
    } catch (error) {
        // Manejamos posible error.
        res.status(401).send(error.message);
    };

}

const register = async (req, res) => {

    // Recibimos la información proveniente de la request.
    const { Nombre, Contrasena } = req.body;

    try {
        // Registramos el usuario y manejamos errores.
        const newUser = await UserRepository.create({ Nombre, Contrasena });
        // Si newUser guarda algo, entonces lo mostramos en json.
        res.status(201).json(newUser);
    } catch (error) {
        // Manejamos posible error.
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