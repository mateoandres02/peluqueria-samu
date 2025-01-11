import { db } from "../database/db.js";
import vouchers from "../models/mVoucher.js";
import users from "../models/mUser.js";
import { eq, like, and, sql } from 'drizzle-orm';

const getActualDate = () => {
  const fechaCreacionUTC = new Date();
  // Convertir a la zona horaria de Argentina (UTC-3)
  const fechaCreacionArgentina = new Date(fechaCreacionUTC.getTime() - (3 * 60 * 60 * 1000));
  // Formatear fecha para eliminar la parte después del "."
  const fechaCreacionFormateada = fechaCreacionArgentina.toISOString().split('.')[0];

  return fechaCreacionFormateada;
}

const getAllVouchers = async (req, res) => {
    try {
        const data = await db.select({
            vale: vouchers,
            barbero: users.Nombre,
        }).from(vouchers)
        .leftJoin(users, eq(users.Id, vouchers.IdUsuario));

        const formattedData = data.map(item => ({
          ...item.vale,
          Barbero: item.barbero || null 
        }));
    
        res.send(formattedData);
    } catch (error) {
        res.status(500).send({
            message: error.message || "Ocurrió algún error recuperando los vouchers."
        });
    }
}

const getAllTurnsByBarber = async (req, res) => {
    try {
        const id = req.params.idUserActive;

        const data = await db.select({
            vouchers: vouchers,
            barbero: users.Nombre,
        })
        .from(vouchers)
        .leftJoin(users, eq(users.Id, vouchers.IdUsuario))
        .leftJoin(services, eq(services.Id, turns.Service))
        .where(eq(vouchers.IdUsuario, id));

        res.send(data);
    } catch (err) {
        res.status(500).send({
            message: err.message || `Ocurrió algún error recuperando los vouchers del peluquero con id ${id}.`
        });
    }
};

const getVoucherById = async (req, res) => {

    try {
        const id = req.params.id;

        const data = await db.select().from(vouchers).where(eq(vouchers.Id, id)).all();

        if (data.length) {
            res.status(200).send(data[0]);
        } else {
            res.status(404).send({
                message: `No se ha encontrado el registro del vale con id = ${id}`
            });
        };

    } catch (err) {
        res.status(500).send({
            message: err.message || `Ocurrió un error al recuperar el registro del vale con id = ${id}`
        });
    }
}

const getVouchersByDateAndBarber = async (req, res) => {
    try {
        const date = req.params.date;
        const barberName = req.params.barberName;

        const data = await db.select({
            vale: vouchers,
            barbero: users.Nombre,
        })
        .from(vouchers)
        .leftJoin(users, eq(users.Id, vouchers.IdUsuario))
        .where(and(like(vouchers.FechaCreacion, `%${date}%`), eq(users.Nombre, barberName)));

        const formattedData = data.map(item => ({
            ...item.vale,
            Barbero: item.barbero || null
        }));

        if (formattedData.length) {
            res.status(200).send(formattedData);
        } else {
            res.status(404).send({
                message: `No se han encontrado vales para ese día.`
            });
        }
    } catch (error) {
        res.status(500).send({
            message: error.message || `Ocurrió un error al recuperar los turnos para el día ${date} y el peluquero con el nombre de ${barberName}.`
        });
    }
}

const getVouchersByBarber = async (req,res) => {
    try {
        const barberName = req.params.barberName;

        const data = await db.select({
            vale: vouchers,
            barbero: users.Nombre,
        })
        .from(vouchers)
        .leftJoin(users, eq(users.Id, vouchers.IdUsuario))
        .where(eq(users.Nombre, barberName));

        const formatedData = data.map(item => ({
            ...item.vale,
            Barbero: item.barbero || null
        }))

        if (formatedData.length) {
            res.status(200).send(formatedData);
        } else {
            res.status(404).send({
                message: `No se han encontrado vales para ese día.`
            });
        };
    } catch (error) {
        res.status(500).send({
            message: error.message || `Ocurrió algún error recuperando el registro de historial con nombre ${barberName}.`
        })
    }
}

const getVouchersByDate = async (req, res) => {
    try {
        const date = req.params.date
        const data = await db.select({
            vale: vouchers,
            barbero: users.Nombre,
        })
        .from(vouchers).leftJoin(users, eq(users.Id, vouchers.IdUsuario))
        .where(like(vouchers.FechaCreacion, `%${date}%`));

        const formattedData = data.map(item => ({
            ...item.vale,
            Barbero: item.barbero || null
        }));

        if (formattedData.length) {
            res.status(200).send(formattedData);
        } else {
            res.status(404).send({
                message: `No se han encontrado vales para ese día.`
            });
        }
    } catch (error) {
        res.status(500).send({
            message: error.message || `Ocurrió algún error recuperando el registro de historial con la fecha de ${date}.`
        })
    }
}

const postVoucher = async (req, res) => {
  try {
      const {Motivo, CantidadDinero, IdUsuario} = req.body;

      if (!Motivo || !CantidadDinero || !IdUsuario) {
          return res.status(400).send({
              message: "¡No hay contenido para el post!"
          });
      }

      const fechaCreacionfmt = getActualDate();

      const newVoucher = {
        IdUsuario,
        Motivo,
        CantidadDinero,
        FechaCreacion: fechaCreacionfmt,
      };

      const response = await db.insert(vouchers).values(newVoucher).returning();

      res.status(201).send(response[0]);
  } catch (e) {
      res.status(500).send({
          message: e.message || "Ocurrió algún error creando un registro de vale de barbero."
      });
  }
};
const updateVoucher = async (req, res) => {
  try {
      const id = req.params.id;

      const fechaCreacionfmt = getActualDate();

      const updatedVoucher = {
        ...req.body,
        FechaCreacion: fechaCreacionfmt,
      };

      const response = await db.update(vouchers)
          .set(updatedVoucher)
          .where(eq(vouchers.Id, id))
          .returning();

      if (response.length) {
          // const updatedTurn = await db.select().from(vouchers).where(eq(vouchers.Id, id)).limit(1);
          res.send(response[0]);
      } else {
          res.status(404);
      }
  } catch (e) {
      res.status(500).send({
          message: e.message || "Ocurrió un error al actualizar el registro del turno con id = " + id
      });
  }
};


const deleteVoucher = async (req, res) => {
  try {
      const id = req.params.id;

      const response = await db.delete(vouchers).where(eq(vouchers.Id, id)).returning();
      if (response.length) {
        res.status(200).send({
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
  getAllVouchers,
  postVoucher,
  deleteVoucher,
  updateVoucher,
  getVoucherById,
  getVouchersByDateAndBarber,
  getVouchersByDate,
  getVouchersByBarber
};

export default actionsTurns;
