import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import users from "./mUser.js";
import services from "./mCutService.js";

const turns = sqliteTable('Turnos', 
    {
        Id: integer('Id').primaryKey({ autoIncrement: true }),
        Nombre: text('Nombre').notNull(),
        Telefono: integer('Telefono', { mode: 'number' }).notNull(),
        Date: text('Date').notNull(),
        Regular: text('Regular').notNull(),
        NroUsuario: integer('NroUsuario', { mode: 'number' }).references(() => users.Id),
        Service: integer('Service', { mode: "number" }).references(() => services.Id),
        Forma_Pago: text('Forma_Pago')
    }
);

export default turns;