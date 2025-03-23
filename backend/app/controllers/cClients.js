import { db } from "../database/db.js";
import { eq, sql } from 'drizzle-orm';
import clients from "../models/mClients.js";


const getAllClients = async (req, res) => {

  try {
    const data = await db.select({
      Id: clients.Id,
      Nombre: clients.Nombre,
      Telefono: clients.Telefono,
    }).from(clients);
    
    if (data.length) {
      res.status(200).send(data);
    } else {
      res.status(404).send({
        message: `No se ha encontrado el registro de los clientes`
      });
    };

  } catch (e) {
    res.status(500).send({
      message: e.message || "Ocurrió algún error recuperando los clientes."
    });
  }

}

const getClientById = async (req, res) => {

  try {
    const id = req.params.id;

    const data = await db.select({
      Id: clients.Id,
      Nombre: clients.Nombre,
      Telefono: clients.Telefono,
    }).from(clients)
    .where(eq(clients.Id, id));

    if (data.length) {
      res.status(200).send(data[0]);
    } else {
      res.status(404).send({
        message: `No se ha encontrado el registro del cliente con id = ${id}`
      });
    };

  } catch (err) {
    res.status(500).send({
      message: err.message || `Ocurrió un error al recuperar el registro del cliente con id = ${id}`
    });
  }
  
}


const postClient = async (req, res) => {
  try {
    const { Nombre, Telefono } = req.body;

    if (!Nombre || !Telefono) {
      return res.status(400).send({
        message: "¡No hay contenido para el post!"
      });
    }
    const nombreBD = await db.select().from(clients).where(sql`lower(${clients.Nombre}) = lower(${Nombre})`).limit(1);
    if (nombreBD.length > 0 && nombreBD[0]?.Nombre.toLowerCase() == Nombre.toLowerCase()) {
      return res.status(400).send({message: "¡El nombre del cliente ya existe!"});
    }

    const newClient = {
      Nombre,
      Telefono
    }

    const response = await db.insert(clients).values(newClient).returning();

    res.status(201).send(response[0]);
  } catch (e) {
    res.status(500).send({
      message: e.message || "Ocurrio algun error creando un registro de un cliente."
    });
  }
};


const updateClient = async (req, res) => {
  try {
    const id = req.params.id;
    const { Nombre, Telefono } = req.body;

    if (!Nombre || !Telefono) {
      return res.status(400).send({
        message: "Nombre y Teléfono son requeridos."
      });
    }

    const response = await db.update(clients)
      .set({ Nombre, Telefono })
      .where(eq(clients.Id,id))
      .returning();

    if (response.length) {     
      res.send(response[0]);
    } else {
      res.status(404).send({
        message: `No se pudo actualizar el registro del cliente con id = ${id}`
      });
    }

  } catch (e) {
    res.status(500).send({
      message: e.message || "Ocurrio algun error actualizando un registro del cliente con id = " + id
    });
  }
}

const deleteClient = async (req, res) => {
  try {
    const id = req.params.id;

    const response = await db.delete(clients)
      .where(eq(clients.Id,id))
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
      message: e.message || "Ocurrio algun error eliminando el registro del cliente con id = " + id 
    });
  }
}

const actionsClients = {
  getAllClients,
  getClientById,
  postClient,
  updateClient,
  deleteClient
};

export default actionsClients;