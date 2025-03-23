import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

const clients = sqliteTable('Clientes', 
  {
    Id: integer('Id').primaryKey({ autoIncrement: true }),
    Nombre: text('Nombre'),
    Telefono: integer('Telefono', { mode: 'number' }),
  }
);

export default clients;