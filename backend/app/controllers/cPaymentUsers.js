import { db } from "../database/db.js";
import { eq, sql } from 'drizzle-orm';
import paymentUsers from "../models/mPaymentUsers.js";
import turns from "../models/mTurn.js";


const getAllPaymentUsers = async (req, res) => {
  try {
    const data = await db.select({
        pago: paymentUsers,
    }).from(paymentUsers)

    const formattedData = data.map(item => item.pago);

    res.send(formattedData)
  } catch (e) {
      res.status(500).send({
          message: e.message || "Ocurrió algún error recuperando los porcentajes de pagos."
      });
    }
}

const getPaymentUsersById = async (req, res) => {

  try {
      const id = req.params.id;

      const data = await db.select().from(paymentUsers).where(eq(paymentUsers.id_usuario, id));

      console.log(data)

      if (data.length) {
          res.status(200).send(data);
      } else {
          res.status(404).send({
              message: `No se ha encontrado el registro del servicio con id = ${id}`
          });
      };

  } catch (err) {
      res.status(500).send({
          message: err.message || `Ocurrió un error al recuperar el registro del servicio con id = ${id}`
      });
  }
  
}
const postPaymentUsers = async (req, res) => {
  try {
    const { id_usuario, porcentaje_inicial, porcentaje_variado } = req.body;

    if (id_usuario === undefined || porcentaje_inicial === undefined || porcentaje_variado === undefined) {
      return res.status(400).send({
        message: "¡No hay contenido para el post!"
      });
    }
    //const nombreBD = await db.select().from(paymentUsers).where(sql`lower(${cutServices.Nombre}) = lower(${Nombre})`).limit(1);
    //if (nombreBD.length > 0 && nombreBD[0]?.Nombre.toLowerCase() == Nombre.toLowerCase()) {
      //return res.status(400).send({message: "¡El nombre del servicio ya existe!"});
    //}

    const newPaymentUsers = {
      id_usuario,
      porcentaje_inicial,
      porcentaje_variado
    }

    const response = await db.insert(paymentUsers).values(newPaymentUsers).returning();

    res.status(201).send(response[0]);
  } catch (e) {
    res.status(500).send({
      message: e.message || "Ocurrio algun error creando un registro de un pago de usuario"
    });
  }
};

const updatePaymentUsers = async (req, res) => {
  try {
    const id = req.params.id;
    const { id_usuario, porcentaje_inicial, porcentaje_variado } = req.body;

    if ( !id_usuario || !porcentaje_inicial || !porcentaje_variado) {
      return res.status(400).send({
        message: "Id de usuario, Porcentaje Estandar y Variable son requeridos."
      });
    }

    const response = await db.update(paymentUsers)
      .set({ id_usuario, porcentaje_inicial, porcentaje_variado })
      .where(eq(paymentUsers.id,id))
      .returning();

    //if (response.length) {
      //const updatedCutService = await db.select().from(cutServices).where(cutServices.Id.eq(id)).limit(1);
    if (response.length) {     
      res.send(response[0]);
    } else {
      res.status(404).send({
        message: `No se pudo actualizar el registro del turno con id = ${id}`
      });
    }

  } catch (e) {
    res.status(500).send({
      message: e.message || "Ocurrio algun error actualizando un registro del pago de usuarios con id = " + id
    });
  }
}

const deletePaymentUsers = async (req, res) => {
  try {
      const id = req.params.id;

      const response = await db.delete(paymentUsers)
          .where(eq(paymentUsers.id, id))
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



const actionsPaymentUsers = {
  getAllPaymentUsers,
  getPaymentUsersById,
  postPaymentUsers,
  updatePaymentUsers,
  deletePaymentUsers
};

export default actionsPaymentUsers;