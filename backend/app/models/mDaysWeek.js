import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

const days = sqliteTable('Dias_Semana', 
    {
        id: integer('id').primaryKey({ autoIncrement: true }),
        dia: text('dia').notNull()
    }
);

export default days;