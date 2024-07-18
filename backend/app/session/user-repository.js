import db from "../database/setup.js";
import bcrypt from "bcrypt";
import { SALT_ROUNDS } from "../../config.js";

const users = db.users;

export class UserRepository {
  
    static async create ({ Nombre, Contrasena }) {

      Validation.username(Nombre);
      Validation.password(Contrasena);

      const user = await users.findOne({ where: { Nombre } });
      if (user) throw new Error('username already exists');      
  
      const hashedPassword = await bcrypt.hash(Contrasena, SALT_ROUNDS);

      const newUser = await users.create({
        Nombre,
        Contrasena: hashedPassword
      });

      return newUser;

    };
  
    static async login ({ Nombre, Contrasena }) {

      Validation.username(Nombre);
      Validation.password(Contrasena);
  
      const user = await users.findOne({ where: { Nombre } });
      console.log(user);
      if (!user) throw new Error('Username does not exists');
  
      const isValid = await bcrypt.compare(Contrasena, user.Contrasena);
      if (!isValid) throw new Error('password is invalid');

      const { password: _, ...publicUser } = user;
 
      return publicUser;
      
    };
    
};

class Validation {
    static username(username) {
      if (typeof username !== 'string') throw new Error('username must be a string');
      if (username.length < 3) throw new Error('username must be at least 3 characters long');
    }
  
    static password(password) {
      if (typeof password !== 'string') throw new Error('password must be a string');
      if (password.length < 6) throw new Error('password must be at least 3 characters long');
    }
}