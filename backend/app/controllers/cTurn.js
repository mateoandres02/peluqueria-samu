import db from "../database/setup.js";
import { Op } from "sequelize";

const turns = db.turns;
const users = db.users;

// getall

const getAllTurns = (req, res) => {

    const id = req.params.idUserActive;

    turns.findAll({
        where: { NroUsuario: id },
        include: [
            { model: users, attributes: ['Nombre'], as: 'peluquero' },
        ]
    })
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message: err.message || "Ocurrió algún error recuperando a todos los turnos."
        });
    });

};

// getbyid

const getByIdTurn = (req, res) => {
    const id = req.params.id;

    turns.findByPk(id,
        {
            include: [
                { model: users, attributes: ['Nombre'], as: 'peluquero' },
            ]
        }
    )
    .then(data => {
        if (data) {
            res.status(200).send(data);
        } else {
            res.status(404).send({
                message: `No se ha encontrado el registro del turno con id = ${id}`
            });
        }
    })
    .catch(e => {
        res.status(500).send({
            message: e.message || `Ocurrió un error al recuperar el registro del turno con id = ${id}`
        });
    });
};

// post

const postTurn = (req, res) => {
    if (!req.body.Nombre ||
        !req.body.Telefono || 
        !req.body.Date || 
        !req.body.NroUsuario) {
            
        res.status(400).send({
            message: "¡No hay contenido para el post!"
        });

        return;
    };

    const turn = {
        Nombre: req.body.Nombre,
        Telefono: req.body.Telefono,
        Date: req.body.Date,
        NroUsuario: req.body.NroUsuario
    };

    turns.create(turn)
    .then(data => {
        res.status(201).send(data);
    })
    .catch(e => {
        res.status(500).send({
            message: e.message || "Ocurrió algun error creando un registro para los turnos."
        });
    });
}

// update

const updateTurn = (req, res) => {
    const id = req.params.id;

    turns.update(req.body, {
        where: { Id: id }
    })
    .then(num => {
        if (num == 1) {

            // Significa que la actualización se hizo correctamente.

            return turns.findByPk(id);

        } else {
            res.status(404).send({
                message: `No se pudo actualizar el registro del turno con id = ${id}`
            });
        }
    })
    .then(data => {
        if (data) {
            res.send(data);
        }
    })
    .catch(e => {
        res.status(500).send({
            message: e.message || "Ocurrió un error al actualizar el registro del turno con id = " + id
        });
    });
}

// delete

const deleteTurn = (req, res) => {
    const id = req.params.id;

    turns.destroy({
        where: { Id: id }
    })
    .then(num => {
        if (num == 1) {
            res.status(204).send({
                message: "¡El registro se eliminó exitosamente!"
            });
        } else {
            res.send({
                message: `No se pudo borrar el registro con id = ${id}`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: err.message || "No se pudo borrar el registro con id = " + id
        });
    });
}

const actionsTurns = {
    getAllTurns,
    getByIdTurn,
    postTurn,
    updateTurn,
    deleteTurn
}

export default actionsTurns;