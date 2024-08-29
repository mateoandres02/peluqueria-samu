import bcrypt from "bcrypt";
import { config } from "../config/config.js";
import { db } from "../database/db.js";
import users from "./mUser.js";
import { eq } from "drizzle-orm";

export class UserRepository {

  static async create({ Nombre, Contrasena, Rol }) {

    Validation.username(Nombre);
    Validation.password(Contrasena);

    const existingUser = await db.select().from(users).where(eq(users.Nombre, Nombre)).limit(1).all();
    if (existingUser.length > 0) throw new Error('El usuario ya existe.');

    const hashedPassword = await bcrypt.hash(Contrasena, config.saltRounds);

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

    Validation.username(Nombre);
    Validation.password(Contrasena);

    const user = await db.select().from(users).where(eq(users.Nombre, Nombre)).limit(1);
    if (user.length === 0) throw new Error('El usuario no existe.');

    // Comparamos la contraseña ingresada por el usuario con la contraseña hasheada en la base de datos.
    const isValid = await bcrypt.compare(Contrasena, user[0].Contrasena);
    if (!isValid) throw new Error('Contraseña incorrecta.');

    // Excluimos la contraseña antes de devolver los datos del usuario.
    const { Contrasena: _, ...publicUser } = user[0];

    return publicUser;
  }
}

export class Validation {

  static username(username) {
    if (typeof username !== 'string') throw new Error('username must be a string');
    if (username.length < 3) throw new Error('El usuario debe de tener al menos 3 caracteres.');
  }

  static password(password) {
    if (typeof password !== 'string') throw new Error('password must be a string');
    if (password.length < 6) throw new Error('La contraseña debe de tener al menos 6 caracteres.');
  }

}