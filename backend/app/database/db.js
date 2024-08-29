import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { config } from "../config/config.js";

// Crear cliente de la base de datos utilizando la configuración.
const client = createClient({ url: config.db_url, authToken: config.db_token });

// Inicializar Drizzle ORM.
export const db = drizzle(client);