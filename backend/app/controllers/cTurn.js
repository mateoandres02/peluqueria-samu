import { db } from "../database/db.js";
import turns from "../models/mTurn.js";
import users from "../models/mUser.js";
import services from "../models/mCutService.js";
import { eq, like, and, sql } from 'drizzle-orm';
import turns_days from "../models/mTurnsDays.js";

const getAllTurns = async (req, res) => {
    try {
        const data = await db.select({
            turns: turns,
            peluquero: users.Nombre,
            servicio: services.Nombre,
            precio: services.Precio,
            date: turns.Date,
            forma_pago: turns.Forma_Pago
        }).from(turns)
        .leftJoin(users, eq(users.Id, turns.NroUsuario))
        .leftJoin(services, eq(services.Id, turns.Service));

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
            turns: turns,
            peluquero: users.Nombre,
            servicio: services.Nombre,
            precio: services.Precio,
            date: turns.Date,
            forma_pago: turns.Forma_Pago
        })
        .from(turns)
        .leftJoin(users, eq(users.Id, turns.NroUsuario))
        .leftJoin(services, eq(services.Id, turns.Service))
        .where(eq(turns.NroUsuario, id));

        res.send(data);
    } catch (err) {
        res.status(500).send({
            message: err.message || `Ocurrió algún error recuperando los turnos del peluquero con id ${id}.`
        });
    }
};

const getTurnById = async (req, res) => {
    try {
        const id = req.params.id;

        const data = await db.select()
        .from(turns)
        .where(turns.Id == id);

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

const getAllTurnsByDate = async (req, res) => {
    try {
        const date = req.params.date;

        const data = await db.select({
            turns: turns,
            peluquero: users.Nombre,
            servicio: services.Nombre,
            precio: services.Precio,
            date: turns.Date,
            forma_pago: turns.Forma_Pago
        }).from(turns)
        .leftJoin(users, eq(users.Id, turns.NroUsuario))
        .leftJoin(services, eq(services.Id, turns.Service))
        .where(like(turns.Date, `%${date}%`));

        if (data.length) {
            res.status(200).send(data);
        } else {
            res.status(404).send({
                message: `No se han encontrado turnos para ese día.`
            });
        }
    } catch (e) {
        res.status(500).send({
            message: e.message || "Ocurrió un error al recuperar los registros que correspondan a ese día"
        })
    }
}

const getAllTurnsByDateAndBarber = async (req, res) => {
    try {
        const date = req.params.date;
        const idUserActive = req.params.idUserActive;

        const data = await db.select({
            turns: turns,
            peluquero: users.Nombre,
            servicio: services.Nombre,
            precio: services.Precio,
            date: turns.Date,
            forma_pago: turns.Forma_Pago
        }).from(turns)
        .leftJoin(users, eq(users.Id, turns.NroUsuario))
        .leftJoin(services, eq(services.Id, turns.Service))
        .where(and(like(turns.Date, `%${date}%`), eq(turns.NroUsuario, idUserActive)));

        res.send(data);

    } catch (e) {
        res.status(500).send({
            message: e.message || `Ocurrió un error al recuperar los turnos para el día ${date} y el peluquero con id ${idUserActive}.`
        });
    }
}

const getAllTurnsByWeek = async (req, res) => {
    try {

        const { startWeek, endWeek } = req.params;

        const data = await db.select({
            turns: turns,
            peluquero: users.Nombre,
            servicio: services.Nombre,
            precio: services.Precio,
            date: turns.Date,
            forma_pago: turns.Forma_Pago
        })
        .from(turns)
        .leftJoin(users, eq(users.Id, turns.NroUsuario))
        .leftJoin(services, eq(services.Id, turns.Service))
        .where(sql`${turns.Date} >= ${startWeek} and ${turns.Date} <= ${endWeek}`);

        res.send(data);
    } catch (error) {
        res.status(500).send({
            message: error.message || `Ocurrió un error al recuperar los turnos de la semana.`
        })
    }
}

const getAllTurnsByWeekAndBarber = async (req, res) => {
    try {

        const { startWeek, endWeek, barberId } = req.params;

        const data = await db.select({
            turns: turns,
            peluquero: users.Nombre,
            servicio: services.Nombre,
            precio: services.Precio,
            date: turns.Date,
            forma_pago: turns.Forma_Pago
        })
        .from(turns)
        .leftJoin(users, eq(users.Id, turns.NroUsuario))
        .leftJoin(services, eq(services.Id, turns.Service))
        .where(sql`${turns.Date} >= ${startWeek} and ${turns.Date} <= ${endWeek} and ${turns.NroUsuario} == ${barberId}`);

        res.send(data);
    } catch (error) {
        res.status(500).send({
            message: error.message || `Ocurrió un error al recuperar los turnos de la semana.`
        })
    }
}

const postTurn = async (req, res) => {
    try {
        const { Nombre, Telefono, Date, Regular, NroUsuario, Service } = req.body;

        if (!Nombre || !Telefono || !Date || !NroUsuario) {
            return res.status(400).send({
                message: "¡No hay contenido para el post!"
            });
        }

        const newTurn = {
            Nombre,
            Telefono,
            Date,
            Regular,
            NroUsuario,
            Service
        };
        
        const response = await db.insert(turns).values(newTurn).returning();
        
        res.status(201).send(response[0]);
        
    } catch (e) {
        res.status(500).send({
            message: e.message || "Ocurrió algún error creando un registro para los turnos."
        });
    };
}
const updateTurn = async (req, res) => {
    try {
        const id = req.params.id;

        const response = await db.update(turns)
            .set(req.body)
            .where(eq(turns.Id, id))
            .returning();

        if (response.length) {
            const updatedTurn = await db.select().from(turns).where(eq(turns.Id, id)).limit(1);
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
        const { id, date } = req.params;

        await db.delete(turns_days).where(and(eq(turns_days.id_turno, id), like(turns_days.date, `%${date}%`)));

        const response = await db.delete(turns)
            .where(and(eq(turns.Id, id), like(turns.Date, `%${date}%`)))
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
    getAllTurnsByDate,
    getAllTurnsByDateAndBarber,
    getTurnById,
    getAllTurnsByWeek,
    getAllTurnsByWeekAndBarber,
    postTurn,
    updateTurn,
    deleteTurn,
};

export default actionsTurns;
