import { db } from "../database/db.js";
import work_sessions from "../models/mWorkSession.js";
import { eq, like, and } from 'drizzle-orm';

const getAllSessions = async (req, res) => {
  try {
      const data = await db.select({
          sesiones_trabajo: work_sessions,
      }).from(work_sessions)
  
      const formattedData = data.map(item => item.sesiones_trabajo);
  
      res.send(formattedData);

  } catch (error) {
      res.status(500).send({
          message: error.message || "Ocurrió algún error recuperando las sesiones."
      });
  }
}

const getAllSessionsByDate = async (req, res) => {
  try {
      const date = req.params.date
      const data = await db.select({
          Id: work_sessions.Id,
          FechaSesion: work_sessions.FechaSesion,
          HorarioInicio: work_sessions.HorarioInicio,
          HorarioFin: work_sessions.HorarioFin,
          CantHoras: work_sessions.CantHoras,
      })
      .from(work_sessions)
      .where(like(work_sessions.FechaSesion, `%${date}%`));

      if (data.length) {
          res.status(200).send(data);
      } else {
          res.status(404).send({
              message: `No se han encontrado sesiones para ese día.`
          });
      }
  } catch (error) {
      res.status(500).send({
          message: error.message || `Ocurrió algún error recuperando el registro de sesiones con la fecha de ${date}.`
      })
  }
}

const postSession = async (req, res) => {
  try {
      const { FechaSesion, HorarioInicio} = req.body;

      const HorarioFin = null 
      const CantHoras = null

      if (!FechaSesion || !HorarioInicio) {
          return res.status(400).send({
              message: "¡Faltan datos requeridos para crear la sesion de trabajo!"
          });
      }

      // const fechaSesionUTC = new Date();
      // // Convertir a la zona horaria de Argentina (UTC-3)
      // const fechaSesionArgentina = new Date(fechaSesionUTC.getTime() - (3 * 60 * 60 * 1000));
      // // Formatear fecha para eliminar la parte después del "."
      // const fechaSesionFormateada = fechaSesionArgentina.toISOString().split('.')[0];

      const newWorkSession = {
        // FechaSesion:fechaCreacionFormateada,
        FechaSesion,
        HorarioInicio,
        HorarioFin, //null
        CantHoras, //null
      };

      const response = await db.insert(work_sessions).values(newWorkSession).returning();

      res.status(201).send(response[0]);
  } catch (e) {
      res.status(500).send({
          message: e.message || "Ocurrió algún error creando un registro de sesiones de trabajo."
      });
  }
};

const deleteWorkSession = async (req, res) => {
  try {
      const id = req.params.id;

      //logAction({
      //    fechaTurno: date,
       //   nombre_cliente: Nombre, // Asegúrate de que este campo esté en el body
      //    nro_barbero: NroUsuario, // Asegúrate de que este campo esté en el body
      //    accion: 'DELETE'
      //});
      // agregué temporalmente para no tener problemas de claves foráneas al eliminar el turno recurrente
      const response = await db.delete(work_sessions).where(eq(work_sessions.Id, id)).returning();

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

const updateSession = async (req, res) => {
    try {
        const id = req.params.id;
        console.log("id", id)
        const { HorarioFin, CantHoras } = req.body;
        console.log("reqbody", req.body)
        
  
        // Verificar si se envió al menos uno de los campos requeridos
        if (HorarioFin === undefined && CantHoras === undefined) {
            console.log("entro al primer if")
            return res.status(400).send({
                message: "Valores de horarioFin y CantHoras no especificadas."
            });
        }
  
        // Construir objeto con solo los campos a actualizar
        const updateData = {};
        updateData.HorarioFin = HorarioFin;
        updateData.CantHoras = CantHoras;
        console.log("updData", updateData);
        // if (HorarioFin !== undefined) updateData.HorarioFin = HorarioFin;
        // if (CantHoras !== undefined) updateData.CantHoras = CantHoras;
  
        const response = await db.update(work_sessions)
            .set(updateData)
            .where(eq(work_sessions.Id, id))
            .returning();
            console.log("response worksessions", response)

        if (response.length) {
            res.send(response[0]);
        } else {
            res.status(404).send({
                message: `No se encontró ninguna sesión con id = ${id}`
            });
        }
    } catch (e) {
        res.status(500).send({
            message: e.message || `Ocurrió un error al actualizar la sesión de trabajo con id = ${id}`
        });
    }
  };

const updateWorkSession = async (req, res) => {
  try {
      const id = req.params.id;

      const response = await db.update(work_sessions)
          .set(req.body)
          .where(eq(work_sessions.Id, id))
          .returning();

      if (response.length) {
          const updatedTurn = await db.select().from(work_sessions).where(eq(turns.Id, id)).limit(1);
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

const actionsWorkSessions = {
    getAllSessions,
    getAllSessionsByDate,
    postSession,
    deleteWorkSession,
    updateSession
};

export default actionsWorkSessions;

