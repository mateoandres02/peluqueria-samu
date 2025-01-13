import { db } from "../database/db.js";
import mUsers from "../models/mUser.js";
import mTurns from "../models/mTurn.js";
import vouchers from "../models/mVoucher.js";
import bcrypt from "bcrypt";
import { config } from "../config/config.js";
import { sql, eq } from 'drizzle-orm';
import { UserRepository, Validation } from "../models/mUserRepository.js";
import paymentUsers from "../models/mPaymentUsers.js";

const users = mUsers;
const turns = mTurns;

const getAllUsers = async (req, res) => {
    try {
        const nombre = req.query.Nombre || "";
        const condicion = `%${nombre}%`;

        const data = await db.select().from(users)
            .where(sql`Nombre LIKE ${condicion}`);

        res.send(data);
        
    } catch (error) {
        res.status(500).send({
            message: error.message || "Ocurrió algún error recuperando a todos los usuarios."
        });
    }
};

const getUserById = async (req, res) => {

    try {
        const id = req.params.id;

        const data = await db.select().from(users).where(eq(users.Id, id)).all();

        if (data.length) {
            res.status(200).send(data[0]);
        } else {
            res.status(404).send({
                message: `No se ha encontrado el registro del usuario con id = ${id}`
            });
        };

    } catch (err) {
        res.status(500).send({
            message: err.message || `Ocurrió un error al recuperar el registro del usuario con id = ${id}`
        });
    }
}

const postUser = async (req, res) => {

    try {

        const { Nombre, Contrasena, Rol } = req.body;

        if (!Nombre || !Contrasena || !Rol) {
            return res.status(400).send({
                message: "¡No hay contenido para el post!"
            });
        }

        const user = {
            Nombre,
            Contrasena,
            Rol
        };

        const response = await UserRepository.create(user);

        if (response.ok) {
            const userCreate = await db.insert(users).values(user).returning();
            res.status(201).send(userCreate[0]);
        } else {
            res.status(401).send({message: 'Ocurrió un error al crear el usuario.'})
        }

    } catch (error) {
        res.status(500).send({
            message: error.message || "Ocurrió algun error creando un registro para los usuarios."
        });
    };

}

const updateUser = async (req, res) => {
    try {

        const id = req.params.id;

        const user = req.body;

        Validation.username(user.Nombre);
        Validation.password(user.Contrasena);

        const hashedPassword = await bcrypt.hash(user.Contrasena, config.saltRounds);
        
        const newUser = {
            Id: id,
            Nombre: user.Nombre,
            Contrasena: hashedPassword,
            Rol: user.Rol
        }

        const response = await db.update(users).set(newUser).where(eq(users.Id, id)).returning();

        if (response.length) {
            res.json(response[0]);
        } else {
            res.status(400).json({
                error: `No se pudo actualizar el registro del usuario con id = ${id}`
            });
        }

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;

        await db.delete(vouchers).where(eq(vouchers.IdUsuario, id));
        await db.delete(turns).where(eq(turns.NroUsuario, id));
        await db.delete(paymentUsers).where(eq(paymentUsers.id_usuario, id));

        const response = await db.delete(users).where(eq(users.Id, id)).returning();

        if (response.length > 0) {
            res.status(200).send({
                message: "¡El registro se eliminó exitosamente!"
            });
        } else {
            res.status(404).send({
                message: `No se pudo borrar el registro con id = ${id}. Registro no encontrado.`
            });
        }
    } catch (err) {
        res.status(500).send({
            message: err.message || `No se pudo borrar el registro con id = ${id}.`
        });
    }
};

const actionsUsers = {
    getAllUsers,
    getUserById,
    postUser,
    updateUser,
    deleteUser
}

export default actionsUsers;