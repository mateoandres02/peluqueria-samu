import { sqliteTable, integer } from 'drizzle-orm/sqlite-core';
import users from "./mUser.js";

const paymentUsers = sqliteTable('Usuarios_Porcentajes', 
    {
        id: integer('id').primaryKey({ autoIncrement: true }),
        id_usuario: integer('id_usuario', { mode: 'number' }).references(() => users.Id),
        porcentaje_inicial: integer('porcentaje_inicial', { mode: 'number' }).notNull(),
        porcentaje_variado: integer('porcentaje_variado', { mode: 'number' }).notNull(),
    }
);

export default paymentUsers;