import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { config } from "../config/config.js";

import users from "../models/mTurn-drizzle.js";
import turns from "../models/mUser-drizzle.js";

// Crear cliente de la base de datos utilizando la configuración.
const client = createClient({ url: config.db_url, authToken: config.db_token });

// Inicializar Drizzle ORM.
export const db = drizzle(client);

// Iniciar la base de datos (no es necesario realizar sync como en Sequelize).
export const dbStart = async () => {
    try {
        // Aquí puedes añadir lógica para manejar migraciones o configuraciones iniciales, si es necesario.
        console.log('Base de datos inicializada.');
    } catch (error) {
        console.error(`Error en la inicialización de la base de datos: ${error.message}`);
    }
};