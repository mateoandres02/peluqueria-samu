// Importamos el método router de express.
import { Router } from "express";

// Importamos los métodos del controlador.
import session from "../controllers/session.controller.js";

// Importamos auth.
import { verifyToken, isAdmin } from '../middlewares/auth.js';

// Iniciamos una nueva instancia de Router.
const sessionRouter = Router();

// Endpoints.
sessionRouter.post('/login', session.login);
sessionRouter.post('/register', session.register);
sessionRouter.post('/logout', session.logout);
sessionRouter.get('/protected', verifyToken, session.routeProtected);
sessionRouter.get('/not-protected', verifyToken, session.routeNotProtected);

// Declaramos la instancia de router como middleware.
const sessionRoutes = (app) => {
    app.use(sessionRouter);
}

export default sessionRoutes;