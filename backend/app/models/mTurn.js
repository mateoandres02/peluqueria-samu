import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import users from "./mUser.js";

const turns = sqliteTable('Turnos', 
    {
        Id: integer('Id').primaryKey({ autoIncrement: true }),
        Nombre: text('Nombre').notNull(),
        Telefono: integer('Telefono', { mode: 'number' }).notNull(),
        Date: text('Date').notNull(),
        NroUsuario: integer('NroUsuario', { mode: 'number' }).references(() => users.Id)
    }
);

export default turns;