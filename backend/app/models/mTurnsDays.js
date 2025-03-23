import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
import turns from "./mTurn.js";
import days from "./mDaysWeek.js";
import cutServices from './mCutService.js';
import method_payment from './mMethodPayment.js';

const turns_days = sqliteTable('Turnos_Dias', 
    {
        id_turno: integer('id_turno', { mode: 'number' }).references(() => turns.Id),
        id_dia: integer('id_dia', { mode: 'number' }).references(() => days.id),
        date: text('date').notNull(),
        exdate: integer('exdate', { mode: 'number' }),
        servicio: integer('servicio', { mode: 'number' }).references(() => cutServices.Id),
        forma_cobro: integer('forma_cobro', { mode: 'number' }).references(() => method_payment.id),
        pago_efectivo: integer('pago_efectivo', { mode: 'number' }),
        pago_transferencia: integer('pago_transferencia', { mode: 'number' })
    },
    (table) => {
        table.uniqueIndex('unique_turno_dia').on('id_turno', 'id_dia', 'date');
    }
);

export default turns_days;