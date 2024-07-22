import dotenv from 'dotenv';

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

// Validar y exportar las configuraciones
export const config = {
    port: process.env.PORT || 3001,
    saltRounds: process.env.SALT_ROUNDS ? parseInt(process.env.SALT_ROUNDS, 10) : 10,
    secretJwtKey: process.env.SECRET_JWT_KEY || '&gP&%g&Y3l%yuQY&%qg&%&uY3f&&gR#1Y&4g%5%4&gYm&Up%3&Yl%'
};