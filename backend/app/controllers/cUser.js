import db from "../database/setup.js";
import { Op } from "sequelize";
import { UserRepository } from "../models/mUserRepository.js";

const users = db.users;

// getall

const getAllUsers = (req, res) => {
    
    const nombre = req.query.Nombre;

    let condicion = [];

    nombre && condicion.push({ Nombre: { [Op.like]: `%${nombre}%` } });
    
    users.findAll({
        where: condicion,
    })
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message: err.message || "Ocurrió algún error recuperando a todos los usuarios."
        });
    });

    // users.findAll()
    // .then(data => {
    //     res.send(data);
    // })
    // .catch(err => {
    //     res.status(500).send({
    //         message: err.message || "Ocurrió algún error recuperando a todos los usuarios."
    //     });
    // });

};

// getbyid

const getByIdUser = (req, res) => {
    const id = req.params.id;

    users.findByPk(id)
    .then(data => {
        if (data) {
            res.status(200).send(data);
        } else {
            res.status(404).send({
                message: `No se ha encontrado el registro de el usuario con id = ${id}`
            });
        }
    })
    .catch(e => {
        res.status(500).send({
            message: e.message || `Ocurrió un error al recuperar el registro del usuario con id = ${id}`
        });
    });
    
}

// post

const postUser = async (req, res) => {
    if (!req.body.Nombre || 
        !req.body.Contrasena ||
        !req.body.Rol) {
            
        res.status(400).send({
            message: "¡No hay contenido para el post!"
        });

        return;
    };

    const user = {
        Nombre: req.body.Nombre,
        Contrasena: req.body.Contrasena,
        Rol: req.body.Rol
    };

    const response = await UserRepository.create(user);

    console.log(response.dataValues)

    if (response.ok) {
        users.create(user)
        .then(data => {
            res.status(201).send(data);
        })
        .catch(e => {
            res.status(500).send({
                message: e.message || "Ocurrió algun error creando un registro para los usuarios."
            });
        });
    } else {
        res.status(401).send({message: 'ocurrió un error al crear el usuario.'})
    }

    // users.UserRepository.create(user)
    // .then(data => {
    //     res.status(201).send(data);
    // })
    // .catch(e => {
    //     res.status(500).send({
    //         message: e.message || "Ocurrió algun error creando un registro para los usuarios."
    //     });
    // });

    // users.UserRepository.create(user)
}

// update

const updateUser = (req, res) => {
    const id = req.params.id;

    users.update(req.body, {
        where: { Id: id }
    })
    .then(num => {
        if (num == 1) {

            // Significa que la actualización se hizo correctamente.

            return users.findByPk(id);

        } else {
            res.status(404).send({
                message: `No se pudo actualizar el registro del usuario con id = ${id}`
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
            message: e.message || "Ocurrió un error al actualizar el registro del usuario con id = " + id
        });
    });
}

// delete

const deleteUser = (req, res) => {
    const id = req.params.id;

    users.destroy({
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

const actionsUsers = {
    getAllUsers,
    getByIdUser,
    postUser,
    updateUser,
    deleteUser
}

export default actionsUsers;