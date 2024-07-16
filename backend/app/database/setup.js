import Sequelize from "sequelize";

import createData from "./init.js";

import turnsModel from "../models/turns.model.js";
import usersModel from "../models/users.model.js";

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './data/database.db'
});

const turns = sequelize.define(
    'Turnos',
    turnsModel.turnsAttributes,
    turnsModel.turnsOptions
);

const users = sequelize.define(
    'Usuarios',
    usersModel.usersAttributes,
    usersModel.usersOptions
);

// users.hasMany(turns, { foreignKey: 'NroUsuario', as: 'nro_usuario' });
turns.belongsTo(users, { foreignKey: 'NroUsuario', as: 'peluquero' });

const start = async (reset = false) => {
    try {

        await sequelize.sync({ force: reset });
        console.log('Base de datos inicializada.');

        if (reset) {
            await loadInitialData();
        }

    } catch (error) {
        console.error(`Error en la creación de la base de datos: ${error.message}`);
    }
};

const loadInitialData = async () => {
    await createData(users, turns);
    console.log('¡Datos iniciales cargados!');
};

export default {
    start,
    sequelize,
    users,
    turns
}

