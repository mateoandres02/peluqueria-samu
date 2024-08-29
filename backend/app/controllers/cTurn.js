import { db } from "../database/db.js";
import turns from "../models/mTurn.js";
import users from "../models/mUser.js";
import { eq } from 'drizzle-orm';

const getAllTurns = async (req, res) => {
    try {
        const data = await db.select({
            turns: turns,
        }).from(turns);

        res.send(data);
    } catch (error) {
        res.status(500).send({
            message: error.message || "Ocurrió algún error recuperando los turnos."
        });
    }
}

const getAllTurnsByBarber = async (req, res) => {
    try {
        const id = req.params.idUserActive;

        const data = await db.select({
            turns: turns, // Selecciona todas las columnas de la tabla turns
            peluquero: users.Nombre // Selecciona la columna Nombre de la tabla users
        })
        .from(turns)
        .leftJoin(users, eq(users.Id, turns.NroUsuario)) // Une la tabla turns con la tabla users en base al ID del usuario
        .where(eq(turns.NroUsuario, id)); // Filtra por el ID del usuario logueado

        res.send(data);
    } catch (err) {
        res.status(500).send({
            message: err.message || `Ocurrió algún error recuperando los turnos del peluquero con id ${id}.`
        });
    }
};

const getByIdTurn = async (req, res) => {
    try {
        const id = req.params.id;

        const data = await db.select({
            turns: turns, // Selecciona todas las columnas de turns
            peluquero: users.Nombre // Selecciona la columna Nombre de users
        })
        .from(turns)
        .leftJoin(users, eq(users.Id, turns.NroUsuario))  // Aquí se utiliza eq() para la condición
        .where(eq(turns.Id, id))  // Aquí también se utiliza eq() para la condición
        .limit(1);

        if (data.length) {
            res.status(200).send(data[0]);
        } else {
            res.status(404).send({
                message: `No se ha encontrado el registro del turno con id = ${id}`
            });
        }
    } catch (err) {
        res.status(500).send({
            message: err.message || `Ocurrió un error al recuperar el registro del turno con id = ${id}`
        });
    }
};

const postTurn = async (req, res) => {
    try {
        const { Nombre, Telefono, Date, NroUsuario } = req.body;

        if (!Nombre || !Telefono || !Date || !NroUsuario) {
            return res.status(400).send({
                message: "¡No hay contenido para el post!"
            });
        }

        const newTurn = {
            Nombre,
            Telefono,
            Date,
            NroUsuario
        };

        const response = await db.insert(turns).values(newTurn).returning();

        res.status(201).send(response[0]);
    } catch (e) {
        res.status(500).send({
            message: e.message || "Ocurrió algún error creando un registro para los turnos."
        });
    }
};

const updateTurn = async (req, res) => {
    try {
        const id = req.params.id;

        const response = await db.update(turns)
            .set(req.body)
            .where(turns.Id.eq(id))
            .returning();

        if (response.length) {
            const updatedTurn = await db.select().from(turns).where(turns.Id.eq(id)).limit(1);
            res.send(updatedTurn[0]);
        } else {
            res.status(404).send({
                message: `No se pudo actualizar el registro del turno con id = ${id}`
            });
        }
    } catch (e) {
        res.status(500).send({
            message: e.message || "Ocurrió un error al actualizar el registro del turno con id = " + id
        });
    }
};

const deleteTurn = async (req, res) => {
    try {
        const id = req.params.id;

        const response = await db.delete(turns)
            .where(eq(turns.Id, id))
            .returning();

        if (response.length) {
            res.status(204).send({
                message: "¡El registro se eliminó exitosamente!"
            });
        } else {
            res.status(404).send({
                message: `No se pudo borrar el registro con id = ${id}`
            });
        }
    } catch (err) {
        res.status(500).send({
            message: err.message || "No se pudo borrar el registro con id = " + id
        });
    }
};

const actionsTurns = {
    getAllTurns,
    getAllTurnsByBarber,
    getByIdTurn,
    postTurn,
    updateTurn,
    deleteTurn
};

export default actionsTurns;
