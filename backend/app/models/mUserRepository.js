import db from "../database/setup.js";
import bcrypt from "bcrypt";
import { config } from "../config/config.js";

// Importamos el modelo de la tabla Usuarios.
const users = db.users;

// Creamos una clase para el manejo de los métodos sobre los usuarios.
export class UserRepository {

  // Declaramos que los métodos sean estáticos para no tener que generar una instancia de esta clase.

  static async create ({ Nombre, Contrasena, Rol }) {

    // Validamos que los parámetros sean lógicos y correctos.
    Validation.username(Nombre);
    Validation.password(Contrasena);

    // Si encontramos un usuario que esté en la base de datos con el nuevo usuario ingresado marcamos que hay un error porque ese usuario ya existe.
    const user = await users.findOne({ where: { Nombre } });
    if (user) throw new Error('username already exists');      

    // Hasheamos la contraseña con bcript.
    const hashedPassword = await bcrypt.hash(Contrasena, config.saltRounds);

    // Creamos un objeto con la nueva información del usuario y lo guardamos en la base de datos.
    const newUser = await users.create({
      Nombre,
      Contrasena: hashedPassword,
      Rol
    });

    return newUser;

  };
  
  static async login ({ Nombre, Contrasena, Rol }) {

    // Validamos que los parámetros sean lógicos y correctos.
    Validation.username(Nombre);
    Validation.password(Contrasena);

    // Si encontramos un usuario que quiera ingresar no esté en la base de datos, entonces marcamos que hay un error diciendo que ese usuario no existe.
    const user = await users.findOne({ where: { Nombre } });
    if (!user) throw new Error('Username does not exists');

    // Comparamos la contraseña ingresada por el usuario con la contraseña hasheada en la base de datos.
    const isValid = await bcrypt.compare(Contrasena, user.Contrasena);
    if (!isValid) throw new Error('password is invalid');

    // Devolvemos el nuevo usuario creado pero sin mostrar información delicada.
    const { Contrasena: _, ...publicUser } = user.dataValues;

    // Si queremos devolver información del usuario, usamos esto.
    return publicUser;
    
  };
    
};

// Creamos una clase de validaciones.
export class Validation {

  // Declaramos los métodos estáticos para no tener que generar una instancia de esta clase para poder usarlos.
  static username(username) {
    if (typeof username !== 'string') throw new Error('username must be a string');
    if (username.length < 3) throw new Error('username must be at least 3 characters long');
  };
  
  static password(password) {
    if (typeof password !== 'string') throw new Error('password must be a string');
    if (password.length < 6) throw new Error('password must be at least 6 characters long');
  };

}