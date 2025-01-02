import dotenv from 'dotenv';

// Carga las variables de entorno desde el archivo .env
dotenv.config();

export const config = {
    port: process.env.PORT || 3001,
    saltRounds: process.env.SALT_ROUNDS ? parseInt(process.env.SALT_ROUNDS, 10) : 10,
    secretJwtKey: process.env.SECRET_JWT_KEY || '&gP&%g&Y3l%yuQY&%qg&%&uY3f&&gR#1Y&4g%5%4&gYm&Up%3&Yl%',
    accessTokenDuration: process.env.ACCESS_TOKEN_EXPIRATION || '5m',
    refreshSecrectJwtKey: process.env.REFRESH_SECRET_KEY || 'R3fr3sh&gP&%g&Y3l%yuQY&%qg&%&uY3f&&gR#1Y&4g%5%4&gYm&Up%3&Yl%',
    refreshTokenDuration: process.env.REFRESH_TOKEN_EXPIRATION || '7d',
    db_url: process.env.DB_URL,
    db_token: process.env.DB_TOKEN,
};