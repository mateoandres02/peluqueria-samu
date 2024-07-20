// Importamos el método router de express.
import { Router } from "express";

// Importamos los métodos del controlador.
import session from "../controllers/session.controller.js";

// Iniciamos una nueva instancia de Router.
const sessionRouter = Router();

// Endpoints.
sessionRouter.post('/login', session.login);
sessionRouter.post('/register', session.register);
sessionRouter.post('/logout', session.logout);

// Declaramos la instancia de router como middleware.
const sessionRoutes = (app) => {
    app.use(sessionRouter);
}

export default sessionRoutes;