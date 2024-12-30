import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

const history_turns = sqliteTable('Historial_Turnos', 
  {
    Id: integer('Id').primaryKey({ autoIncrement: true }),
    Barbero: text('Barbero').notNull(),
    Cliente: text('Cliente').notNull(),
    FechaTurno: text('FechaTurno').notNull(),
    FechaCreacion: text('FechaCreacion'),
    Fijo: text("fijo"),
    Accion: text('Accion').notNull(),
  }
);

export default history_turns;