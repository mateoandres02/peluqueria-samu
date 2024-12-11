import { db } from "../database/db.js";
import { eq } from 'drizzle-orm';
import cutServices from "../models/mCutService.js";

const getAllCutServices = async (req, res) => {

  try {
    const data = await db.select({
        servicio: cutServices,
    }).from(cutServices)

    const formattedData = data.map(item => item.servicio);

    res.send(formattedData)
  } catch (e) {
    res.status(500).send({
        message: e.message || "Ocurrió algún error recuperando los  tipos de servicios de corte."
    });
  }

}

const getServiceById = async (req, res) => {

  try {
    const id = req.params.id;

    const data = await db.select().from(cutServices).where(eq(cutServices.Id, id)).all();

    if (data.length) {
        res.status(200).send(data[0]);
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
const postCutService = async (req, res) => {
  try {
    const { Nombre, Precio } = req.body;

    if ( !Nombre || !Precio ) {
      return res.status(400).send({
        message: "¡No hay contenido para el post!"
      })
    }

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
    const { Nombre, Precio } = req.body;

    if (!Nombre || !Precio) {
      return res.status(400).send({
        message: "Nombre y Precio son requeridos."
      });
    }

    const response = await db.update(cutServices)
      .set({ Nombre, Precio })
      .where(eq(cutServices.Id,id))
      .returning();

    if (response.length) {     
      res.send(response[0]);
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
      .where(eq(cutServices.Id,id))
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
  getServiceById,
  postCutService,
  updateCutService,
  deleteCutService
};

export default actionsCutServices;