import { db } from "../database/db.js";
import { eq } from 'drizzle-orm';
import cutServices from "../models/mCutService.js";


const getAllCutServices = async (req, res) => {
  try {
    // tengo que continuar aca
    const data = await db.select({
        tipoServicio: cutServices,
    }).from(cutServices)

    res.send(data);
} catch (e) {
    res.status(500).send({
        message: e.message || "Ocurrió algún error recuperando los tipos de servicios de corte."
    });
}
}

const postCutService = async (req, res) => {
  try {
    const { Nombre, Precio } = req.body;

    if ( !Nombre || !Precio ) {
      return res.status(400).send({
        message: "¡No hay contenido para el post!"
      })
    }

    // preguntar a chino porque no el else
    const newCutService = {
      Nombre,
      Precio
    }

    const response = await db.insert(cutServices).values(newCutService).returning();

    res.status(201).send(response[0]);
  } catch (e) {
    res.status(500).send({
      message: e.message || "Ocurrio algun error creando un registro de un tipo de servicio de corte."
    });
  }
};

const updateCutService = async (req, res) => {
  try {
    const id = req.params.id;

    const response = await db.update(cutServices)
      .set(req.body)
      .where(cutServices.Id.eq(id))
      .returning();

    if (response.length) {
      const updatedCutService = await db.select().from(cutServices).where(cutServices.Id.eq(id)).limit(1);
      
      res.send(updatedCutService[0]);
    } else {
      res.status(404).send({
        message: `No se pudo actualizar el registro del turno con id = ${id}`
      });
    }

  } catch (e) {
    res.status(500).send({
      message: e.message || "Ocurrio algun error actualizando un registro de un tipo de servicio de corte con id = " + id
    });
  }
}

const deleteCutService = async (req, res) => {
  try {
    const id = req.params.id;

    const response = await db.delete(cutServices)
      .where(cutServices.Id.eq(id))
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
  } catch (e) {
    res.status(500).send({
      message: e.message || "Ocurrio algun error eliminando un registro de un tipo de servicio de corte con id = " + id 
    });
  }
}

const actionsCutServices = {
  getAllCutServices,
  postCutService,
  updateCutService,
  deleteCutService
};

export default actionsCutServices;