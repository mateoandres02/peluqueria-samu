import express from "express";
import cors from "cors";
import cookieParser from 'cookie-parser';
import { config } from "./app/config/config.js";
import { verifyToken } from "./app/middlewares/auth.js";
import { corsOptions } from "./app/middlewares/cors.js";
import routesSession from "./app/routes/rSession.js";
import routesUser from "./app/routes/rUser.js";
import routesTurn from "./app/routes/rTurn.js";
import routesCutService from "./app/routes/rCutService.js";
import routesPaymentUsers from "./app/routes/rPaymentUsers.js";
import routesTurnsDays from "./app/routes/rTurnsDays.js";
import routesHistoryLog from "./app/routes/rHistoryLog.js";

const app = express();

// Middlewares.
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.json());

app.use(cors(corsOptions));

// Endpoints.
app.use(routesSession);

// Ruta protegida para verificar el token
app.get('/verify-token', verifyToken, (req, res) => {
  const user = req.user;
  res.status(200).send({ user });
});

// Otras rutas de tu aplicación
app.use(verifyToken, routesTurn);
app.use(verifyToken, routesUser);
app.use(verifyToken, routesCutService);
app.use(verifyToken, routesTurnsDays);
app.use(verifyToken, routesPaymentUsers);
app.use(verifyToken, routesHistoryLog);

// Iniciar el servidor en el puerto configurado
app.listen(config.port, () => {
  console.log(`Servidor iniciado en http://localhost:${config.port}`);
});

export default app;
