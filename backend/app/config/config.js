import dotenv from 'dotenv';

dotenv.config();

export const config = {
    port: process.env.PORT,
    saltRounds: process.env.SALT_ROUNDS ? parseInt(process.env.SALT_ROUNDS, 10) : 10,
    secretJwtKey: process.env.SECRET_JWT_KEY,
    db_url: process.env.DB_URL,
    db_token: process.env.DB_TOKEN,
    accessTokenDuration: '10h',
    refreshTokenDuration: '24h',
    refreshTokenKey: 'R3fr3sh&gP&%g&Y3l%yuQY&%qg&%&uY3f&&gR#1Y&4g%5%4&gYm&Up%3&Yl%70k3nK3y'
};
