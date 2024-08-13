import bcrypt from "bcrypt";
import { config } from "../config/config.js";
import { db } from "../database/db.js";
import users from "../models/mUser-drizzle.js";
import { eq } from "drizzle-orm";

// Creamos una clase para el manejo de los métodos sobre los usuarios.
export class UserRepository {

  // Declaramos que los métodos sean estáticos para no tener que generar una instancia de esta clase.

  static async create({ Nombre, Contrasena, Rol }) {

    // Validamos que los parámetros sean lógicos y correctos.
    Validation.username(Nombre);
    Validation.password(Contrasena);

    // Si encontramos un usuario que esté en la base de datos con el nuevo usuario ingresado marcamos que hay un error porque ese usuario ya existe.
    const existingUser = await db.select().from(users).where(eq(users.Nombre, Nombre)).limit(1).all();
    if (existingUser.length > 0) throw new Error('username already exists');

    // Hasheamos la contraseña con bcrypt.
    const hashedPassword = await bcrypt.hash(Contrasena, config.saltRounds);

    // Creamos un objeto con la nueva información del usuario y lo guardamos en la base de datos.
    const newUser = await db.insert(users).values({
      Nombre,
      Contrasena: hashedPassword,
      Rol
    }).returning({
      Nombre: users.Nombre,
      Rol: users.Rol
    }).all();

    return newUser[0];
  }

  static async login({ Nombre, Contrasena }) {

    // Validamos que los parámetros sean lógicos y correctos.
    Validation.username(Nombre);
    Validation.password(Contrasena);

    // Buscamos el usuario en la base de datos.
    const user = await db.select().from(users).where(eq(users.Nombre, Nombre)).limit(1);
    if (user.length === 0) throw new Error('Username does not exist');

    // Comparamos la contraseña ingresada por el usuario con la contraseña hasheada en la base de datos.
    const isValid = await bcrypt.compare(Contrasena, user[0].Contrasena);
    if (!isValid) throw new Error('password is invalid');

    // Excluimos la contraseña antes de devolver los datos del usuario.
    const { Contrasena: _, ...publicUser } = user[0];

    return publicUser;
  }
}

export class Validation {

  static username(username) {
    if (typeof username !== 'string') throw new Error('username must be a string');
    if (username.length < 3) throw new Error('username must be at least 3 characters long');
  }

  static password(password) {
    if (typeof password !== 'string') throw new Error('password must be a string');
    if (password.length < 6) throw new Error('password must be at least 6 characters long');
  }

}