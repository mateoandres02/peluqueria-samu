import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import users from "./mUser.js";
import services from "./mCutService.js";
import method_payment from "./mMethodPayment.js";

const turns = sqliteTable('Turnos', 
    {
        Id: integer('Id').primaryKey({ autoIncrement: true }),
        Nombre: text('Nombre').notNull(),
        Telefono: integer('Telefono', { mode: 'number' }).notNull(),
        Date: text('Date').notNull(),
        Regular: text('Regular').notNull(),
        NroUsuario: integer('NroUsuario', { mode: 'number' }).references(() => users.Id),
        Service: integer('Service', { mode: "number" }).references(() => services.Id, { onUpdate: "cascade" }),
        Forma_Cobro: integer('Forma_Cobro', { mode: "number" }).references(() => method_payment.id),
        Pago_Efectivo: integer('Pago_Efectivo', { mode: "number" }),
        Pago_Transferencia: integer('Pago_Transferencia', { mode: "number" })
    }
);

export default turns;