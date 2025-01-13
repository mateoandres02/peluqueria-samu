import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import users from "./mUser.js";


const historialVales = sqliteTable('Historial_Vales', 
  {
    Id: integer('Id').primaryKey({ autoIncrement: true }),
    IdUsuario: integer('id_usuario', { mode: 'number' }).references(() => users.Id),
    CantidadDinero: integer('vale', { mode: 'number' }).notNull(),
    Motivo: text('motivo').notNull(),
    FechaCreacion: text('fecha_creacion'),
  }
);

export default historialVales;