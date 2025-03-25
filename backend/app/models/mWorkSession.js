import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

const work_sessions = sqliteTable('Sesiones_Trabajo', 
  {
    Id: integer('Id').primaryKey({autoIncrement: true}),
    FechaSesion: text('FechaSesion').notNull(),
    HorarioInicio: text('HorarioInicio'),
    HorarioFin: text('HorarioFin'),
    CantHoras: text('CantHoras'),
  }
);

export default work_sessions;