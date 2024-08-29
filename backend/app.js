import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "./app/config/config.js";
import { verifyToken } from "./app/middlewares/auth.js";
import { corsOptions } from "./app/middlewares/cors.js";
import routesSession from "./app/routes/rSession.js";
import routesUser from "./app/routes/rUser-drizzle.js";
import routesTurn from "./app/routes/rTurn-drizzle.js";

const app = express();

// Middlewares.
app.use(express.json());
app.use(cookieParser());
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
