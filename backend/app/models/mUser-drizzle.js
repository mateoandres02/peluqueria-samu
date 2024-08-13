import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

const users = sqliteTable('Usuarios', 
    {
        Id: integer('Id').primaryKey({ autoIncrement: true }),
        Nombre: text('Nombre').notNull(),
        Contrasena: text('Contrasena').notNull(),
        Rol: text('Rol').notNull().default('Empleado')
    }
);

export default users;