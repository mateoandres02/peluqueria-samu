import { sqliteTable, integer } from 'drizzle-orm/sqlite-core';
import users from "./mUser.js";
import cutServices from './mCutService.js';

const paymentUsers = sqliteTable('Usuarios_Porcentajes', 
    {
        id_usuario: integer('id_usuario', { mode: 'number' }).references(() => users.Id),
        id_servicio: integer('id_servicio', { mode: 'number' }).references(() => cutServices.Id),
        porcentaje_pago: integer('porcentaje_pago', { mode: 'number' }).notNull(),
    },
    (table) => {
        // table.uniqueIndex('unique_user_service').on('id_usuario', 'id_servicio');
        table.primaryKey('id_usuario', 'id_servicio');
    }
);

export default paymentUsers;