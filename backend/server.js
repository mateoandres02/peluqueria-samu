// Importamos dependencias.
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// Importamos componentes.
import { config } from "./app/config/config.js";
import db from "./app/database/setup.js";
import routesSession from "./app/routes/rSession.js";
import routesUser from "./app/routes/rUser.js";
import routesTurn from "./app/routes/rTurn.js";
import { verifyToken } from "./app/middlewares/auth.js";

// Iniciamos la aplicación con express.
const app = express();

// Middlewares.
app.use(express.json());
// Configuramos el cors para que acepte request de otro servidor (en este caso, del front ya que está separado del back)
app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true
}));
app.use(cookieParser());

// Iniciamos la base de datos.
db.start();

// Endpoints.
app.use(routesSession);

app.get('/verify-token', verifyToken, (req, res) => {
    // Obtenemos el user logueado de la request.
    const user = req.user;
    
    // Se lo enviamos de nuevo para que el front lo manipule.
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