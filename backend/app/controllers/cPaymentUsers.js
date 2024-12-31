import { db } from "../database/db.js";
import { eq, and } from 'drizzle-orm';
import paymentUsers from "../models/mPaymentUsers.js";
import cutServices from "../models/mCutService.js";


const getAllPaymentUsers = async (req, res) => {
  try {
    const data = await db.select().from(paymentUsers)

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

      const data = await db
      .select({ 
        id_usuario: paymentUsers.id_usuario, 
        id_servicio: paymentUsers.id_servicio, 
        servicio: cutServices.Nombre,
        porcentaje_pago: paymentUsers.porcentaje_pago 
      })
      .from(paymentUsers)
      .leftJoin(cutServices, eq(cutServices.Id, paymentUsers.id_servicio))
      .where(eq(paymentUsers.id_usuario, id));

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
    const id_usuario = parseInt(req.params.id_usuario);
    const id_servicio = parseInt(req.params.id_servicio);

    const { porcentaje_pago } = req.body;
    
    if (!porcentaje_pago) {
      return res.status(400).send({
        message: "No hay ningun valor recibido."
      });
    }

    const response = await db.update(paymentUsers)
      .set(req.body)
      .where(
        and(
          eq(paymentUsers.id_usuario, id_usuario),
          eq(paymentUsers.id_servicio, id_servicio)
        )
      );

    if (response.rowsAffected > 0) {     
      res.send(response[0]);
    } else {
      res.status(404).send({
        message: `No se pudo actualizar el registro`
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