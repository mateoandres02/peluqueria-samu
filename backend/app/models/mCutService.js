import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

const cutServices = sqliteTable('Servicio', 
  {
      Id: integer('Id').primaryKey({ autoIncrement: true }),
      Nombre: text('Nombre').notNull(),
      Precio: integer('Precio', { mode: 'number' }).notNull(),
  }
);

export default cutServices;