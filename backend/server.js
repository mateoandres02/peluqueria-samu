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
import { isAdmin, verifyToken } from "./app/middlewares/auth.js";

// Importamos modulos de node.
import path from "path";

// Iniciamos la aplicación con express.
const app = express();

// __dirname
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Middlewares.
app.use(express.static(path.join(__dirname, '../frontend')));
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
    res.send('<h1>Hola mundo</h1>');
});

app.get("/", verifyToken, (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
})

app.use(routesTurn);
app.use(routesUser);

// Levantamos el puerto.
app.listen(config.port, () => {
    console.log(`
        Servidor iniciado en http://localhost:${config.port}
    `);
});

export default app;