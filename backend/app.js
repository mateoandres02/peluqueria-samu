// Importamos dependencias.
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// Importamos componentes.
import { config } from "./app/config/config.js";
import { dbStart } from "./app/database/db.js";  // Modificado para importar el nuevo setup
import routesSession from "./app/routes/rSession.js";
import routesUser from "./app/routes/rUser-drizzle.js";
import routesTurn from "./app/routes/rTurn-drizzle.js";
import { verifyToken } from "./app/middlewares/auth.js";

// Iniciamos la aplicación con express.
const app = express();

// Middlewares.
app.use(express.json());
app.use(cors({
    origin: "https://peluqueria-invasion-front.vercel.app/",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    allowedHeaders: "Content-Type,Authorization"
}));
app.use(cookieParser());

app.options('*', cors());

// Iniciamos la base de datos.
dbStart();

// Endpoints.
app.use(routesSession);

app.get('/verify-token', verifyToken, (req, res) => {
    const user = req.user;
    res.send({ user });
});

app.use(routesTurn);
app.use(routesUser);

// Levantamos el puerto.
app.listen(config.port, () => {
    console.log(`
        Servidor iniciado en http://localhost:${config.port}
    `);
});

export default app;
