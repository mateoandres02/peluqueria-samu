import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

const method_payment = sqliteTable('Forma_Pago', 
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    descripcion: text('descripcion').notNull()
  }
);

export default method_payment;