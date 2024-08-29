import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "./app/config/config.js";
import { verifyToken } from "./app/middlewares/auth.js";
// import { corsOptions } from "./app/middlewares/cors.js";
import routesSession from "./app/routes/rSession.js";
import routesUser from "./app/routes/rUser-drizzle.js";
import routesTurn from "./app/routes/rTurn-drizzle.js";

const app = express();

// Middlewares.
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = ['https://peluqueria-invasion.vercel.app', 'http://localhost:5173/'];

const corsOptions = {
  origin: function (origin, callback) {
    // Verificamos si el origen de la petición que llega está en la lista de orígenes permitidos
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Permitir el envío de cookies y credenciales
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Métodos HTTP permitidos
  allowedHeaders: 'Content-Type,Authorization', // Encabezados permitidos
};

app.use(cors(corsOptions));

// Endpoints.
app.use(routesSession);

app.get('/verify-token', verifyToken, (req, res) => {
  const user = req.user;
  res.send({ user });
});

app.use(verifyToken, routesTurn);
app.use(verifyToken, routesUser);

// Levantamos el puerto.
app.listen(config.port, () => {
  console.log(`Servidor iniciado en http://localhost:${config.port}`);
});

export default app;
