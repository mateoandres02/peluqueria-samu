import { sqliteTable, integer } from 'drizzle-orm/sqlite-core';
import users from "./mUser.js";
import cutServices from './mCutService.js';

const paymentUsers = sqliteTable('Usuarios_Porcentajes', 
    {
        id_usuario: integer('id_usuario', { mode: 'number' }).references(() => users.Id),
        id_servicio: integer('id_servicio', { mode: 'number' }).references(() => cutServices.Id),
        porcentaje_inicial: integer('porcentaje_inicial', { mode: 'number' }).notNull(),
        porcentaje_final: integer('porcentaje_final', { mode: 'number' }).notNull(),
    },
    (table) => {
        table.uniqueIndex('unique_user_service').on('id_usuario', 'id_servicio');
    }
);

export default paymentUsers;