import { db } from "../database/db.js";
import turns from "../models/mTurn.js"
import turns_days from "../models/mTurnsDays.js";
import users from "../models/mUser.js";
import services from "../models/mCutService.js";
import days from "../models/mDaysWeek.js";
import { eq, like, and } from 'drizzle-orm';

const getAllRecurrentTurns = async (req, res) => {

    try {
        const data = await db
            .select()
            .from(turns_days)
            .leftJoin(turns, eq(turns.Id, turns_days.id_turno))
            .leftJoin(days, eq(days.id, turns_days.id_dia));

        res.send(data);
    } catch (error) {
        res.status(500).send({
            message: error.message || "Ocurrió un error recuperando los turnos y días.",
        });
    }

};

const getRecurrentTurnById = async (req, res) => {

    try {
        const id = req.params.id;

        const data = await db
            .select({
                id_turno: turns_days.id_turno,
                id_dia: turns_days.id_dia,
                date: turns.Date,
            })
            .from(turns_days)
            .leftJoin(turns, eq(turns.Id, turns_days.id_turno))
            .leftJoin(days, eq(days.id, turns_days.id_dia))
            .where(eq(turns_days.id_turno, id));

        if (data.length) {
            res.status(200).send(data);
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

const getAllRecurrentTurnsDaysByBarber = async (req, res) => {
    try {
        const id = req.params.idUserActive;
        
        const data = await db
            .select({
                turno: turns.Id,
                dia: days.dia,
                date: turns_days.date,
                exdate: turns_days.exdate
            })
            .from(turns_days)
            .leftJoin(turns, eq(turns.Id, turns_days.id_turno))
            .leftJoin(days, eq(days.id, turns_days.id_dia))
            .where(eq(turns.NroUsuario, id));

        // Organizar los días por turno
        const turnsWithDays = data.reduce((acc, curr) => {
            const { turno, dia, date, exdate } = curr;
            if (!acc[turno]) {
                acc[turno] = [];
            }
            acc[turno].push({dia, date, exdate});
            return acc;
        }, {});
        
        res.send(turnsWithDays);

    } catch (err) {
        res.status(500).send({
            message: err.message || `Ocurrió algún error recuperando los turnos del peluquero con id ${id}.`
        });
    }
};

const getAllRecurrentTurnsDaysByDate = async (req, res) => {
    try {
        const date = req.params.date;

        const data = await db.select({
            turns: turns,
            peluquero: users.Nombre,
            servicio: services.Nombre,
            precio: services.Precio,
            exdate: turns_days.exdate,
            date: turns_days.date
        }).from(turns_days)
        .leftJoin(turns, eq(turns.Id, turns_days.id_turno))
        .leftJoin(users, eq(users.Id, turns.NroUsuario))
        .leftJoin(services, eq(services.Id, turns.Service))
        .where(like(turns_days.date, `%${date}%`));

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

const getAllRecurrentTurnsByDateAndBarber = async (req, res) => {
    try {
        const date = req.params.date;
        const idUserActive = req.params.idUserActive;

        const data = await db.select({
            turns: turns,
            peluquero: users.Nombre,
            servicio: services.Nombre,
            precio: services.Precio,
            exdate: turns_days.exdate,
            date: turns_days.date
        }).from(turns_days)
        .leftJoin(turns, eq(turns.Id, turns_days.id_turno))
        .leftJoin(users, eq(users.Id, turns.NroUsuario))
        .leftJoin(services, eq(services.Id, turns.Service))
        .where(and(like(turns_days.date, `%${date}%`), eq(turns.NroUsuario, idUserActive)));

        res.send(data);

    } catch (e) {
        res.status(500).send({
            message: e.message || `Ocurrió un error al recuperar los turnos para el día ${date} y el peluquero con id ${idUserActive}.`
        });
    }
}

const postTurnRecurrentDay = async (req, res) => {
    try {
        const { id_turno, id_dia, date } = req.body;

        if (!id_turno || id_dia == undefined || !date) {
            return res.status(400).send({
                message: "¡Faltan datos para crear el registro!",
            });
        }

        const newTurnDay = { id_turno, id_dia, date, exdate: 0 };

        const response = await db.insert(turns_days).values(newTurnDay).returning();

        res.status(201).send(response[0]);
    } catch (error) {
        if (error.message.includes('UNIQUE constraint')) {
            return res.status(409).send({
              message: "El turno ya existe para esa fecha.",
            });
          }
        res.status(500).send({
            message: error.message || "Ocurrió un error creando un registro en Turnos_Dias.",
        });
    }
};


// const updateTurn = async (req, res) => {
//     try {
//         const id = req.params.id;

//         const response = await db.update(turns)
//             .set(req.body)
//             .where(eq(turns.Id, id))
//             .returning();

//         if (response.length) {
//             const updatedTurn = await db.select().from(turns).where(eq(turns.Id, id)).limit(1);
//             res.send(updatedTurn[0]);
//         } else {
//             res.status(404).send({
//                 message: `No se pudo actualizar el registro del turno con id = ${id}`
//             });
//         }
//     } catch (e) {
//         res.status(500).send({
//             message: e.message || "Ocurrió un error al actualizar el registro del turno con id = " + id
//         });
//     }
// };

const deleteTurnOfRecurrentTurns = async (req, res) => {
    try {
        const { id, date } = req.params;

        const response = await db.update(turns_days).set({exdate: 1}).where(and(eq(turns_days.id_turno, id), like(turns_days.date, `%${date}%`))).returning();

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
    getAllRecurrentTurns,
    getRecurrentTurnById,
    getAllRecurrentTurnsDaysByBarber,
    getAllRecurrentTurnsDaysByDate,
    getAllRecurrentTurnsByDateAndBarber,
    postTurnRecurrentDay,
    deleteTurnOfRecurrentTurns
};

export default actionsTurns;