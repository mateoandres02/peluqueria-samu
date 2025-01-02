import { db } from "../database/db.js";
import history_turns from "../models/mHistoryLog.js";
import { eq, like, and } from 'drizzle-orm';

const getAllHistory = async (req, res) => {
    try {
        const data = await db.select({
            turnos_historial: history_turns,
        }).from(history_turns)
    
        const formattedData = data.map(item => item.turnos_historial);
    
        res.send(formattedData);

    } catch (error) {
        res.status(500).send({
            message: error.message || "Ocurrió algún error recuperando el historial."
        });
    }
}

const getAllTurnsHistoryByBarber = async (req,res) => {
    try {
        const barberName = req.params.barberName;

        const data = await db.select({
            Id: history_turns.Id,
            Barbero: history_turns.Barbero,
            Cliente: history_turns.Cliente,
            FechaTurno: history_turns.FechaTurno,
            FechaCreacion: history_turns.FechaCreacion,
            Fijo: history_turns.Fijo,
            Accion: history_turns.Accion
        })
        .from(history_turns)
        .where(eq(history_turns.Barbero, barberName));

        if (data.length) {
            res.status(200).send(data);
        } else {
            res.status(404).send({
                message: `No se han encontrado turnos para ese día.`
            });
        };
    } catch (error) {
        res.status(500).send({
            message: error.message || `Ocurrió algún error recuperando el registro de historial con nombre ${barberName}.`
        })
    }
}

const getAllTurnsHistoryByDate = async (req, res) => {
    try {
        const date = req.params.date
        const data = await db.select({
            Id: history_turns.Id,
            Barbero: history_turns.Barbero,
            Cliente: history_turns.Cliente,
            FechaTurno: history_turns.FechaTurno,
            FechaCreacion: history_turns.FechaCreacion,
            Fijo: history_turns.Fijo,
            Accion: history_turns.Accion
        })
        .from(history_turns)
        .where(like(history_turns.FechaCreacion, `%${date}%`));

        if (data.length) {
            res.status(200).send(data);
        } else {
            res.status(404).send({
                message: `No se han encontrado turnos para ese día.`
            });
        }
    } catch (error) {
        res.status(500).send({
            message: error.message || `Ocurrió algún error recuperando el registro de historial con la fecha de ${date}.`
        })
    }
}

const getAllTurnsHistoryByDateAndBarber = async (req, res) => {
    try {
        const date = req.params.date;
        const barberName = req.params.barberName;

        const data = await db.select({
            Id: history_turns.Id,
            Barbero: history_turns.Barbero,
            Cliente: history_turns.Cliente,
            FechaTurno: history_turns.FechaTurno,
            FechaCreacion: history_turns.FechaCreacion,
            Fijo: history_turns.Fijo,
            Accion: history_turns.Accion
        }).from(history_turns)
        .where(and(like(history_turns.FechaCreacion, `%${date}%`), eq(history_turns.Barbero, barberName)));

        if (data.length) {
            res.status(200).send(data);
        } else {
            res.status(404).send({
                message: `No se han encontrado turnos para ese día.`
            });
        }
    } catch (error) {
        res.status(500).send({
            message: error.message || `Ocurrió un error al recuperar los turnos para el día ${date} y el peluquero con el nombre de ${barberName}.`
        });
    }
}

const postTurnHistoryLog = async (req, res) => {
    try {
        const { Barbero, Cliente, FechaTurno, Fijo, Accion } = req.body;

        if (!Barbero || !Cliente || !FechaTurno || !Accion) {
            return res.status(400).send({
                message: "¡No hay contenido para el post!"
            });
        }

        const fechaCreacionUTC = new Date();
        // Convertir a la zona horaria de Argentina (UTC-3)
        const fechaCreacionArgentina = new Date(fechaCreacionUTC.getTime() - (3 * 60 * 60 * 1000));
        // Formatear fecha para eliminar la parte después del "."
        const fechaCreacionFormateada = fechaCreacionArgentina.toISOString().split('.')[0];

        const newTurnHistoryLog = {
            Barbero,
            Cliente,
            FechaTurno,
            FechaCreacion: fechaCreacionFormateada,
            Fijo,
            Accion
        };

        const response = await db.insert(history_turns).values(newTurnHistoryLog).returning();

        res.status(201).send(response[0]);
    } catch (e) {
        res.status(500).send({
            message: e.message || "Ocurrió algún error creando un registro de historial."
        });
    }
};

const deleteHistoryTurn = async (req, res) => {
    try {
        const id = req.params.id;

        //logAction({
        //    fechaTurno: date,
         //   nombre_cliente: Nombre, // Asegúrate de que este campo esté en el body
        //    nro_barbero: NroUsuario, // Asegúrate de que este campo esté en el body
        //    accion: 'DELETE'
        //});
        // agregué temporalmente para no tener problemas de claves foráneas al eliminar el turno recurrente
        const response = await db.delete(history_turns).where(eq(history_turns.Id, id)).returning();

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
    getAllHistory,
    postTurnHistoryLog,
    deleteHistoryTurn,
    getAllTurnsHistoryByBarber,
    getAllTurnsHistoryByDate,
    getAllTurnsHistoryByDateAndBarber
};

export default actionsTurns;
