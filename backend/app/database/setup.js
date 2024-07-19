import Sequelize from "sequelize";

// Importamos la función de carga de datos iniciales para la base de datos.
// import createData from "./init.js";

// Importamos los modelos de la base de datos.
import turnsModel from "../models/turns.model.js";
import usersModel from "../models/users.model.js";

// Creamos una instancia de Sequelize.
const sequelize = new Sequelize({
    // Indicamos el motor con el que vamos a trabajar.
    dialect: 'sqlite',
    // Indicamos el lugar donde va a estar la base de datos.
    storage: './data/database.db'
});

// Definimos los modelos.
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

// Establecemos relaciones entre las tablas.
turns.belongsTo(users, { foreignKey: 'NroUsuario', as: 'peluquero' });

// Iniciamos la base de datos.
const start = async (reset = false) => {
    try {

        await sequelize.sync({ force: reset });
        console.log('Base de datos inicializada.');

        // Manejamos la carga de datos iniciales o no en la base de datos.
        // if (reset) {
        //     await loadInitialData();
        // }

    } catch (error) {
        console.error(`Error en la creación de la base de datos: ${error.message}`);
    }
};

// Carga de datos iniciales.
// const loadInitialData = async () => {
//     await createData(users, turns);
//     console.log('¡Datos iniciales cargados!');
// };

export default {
    start,
    sequelize,
    users,
    turns
}

