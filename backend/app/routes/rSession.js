// Importamos el módulo router de express.
import { Router } from "express";

// Importamos los métodos del controlador.
import session from "../controllers/cSession.js";

// Iniciamos una nueva instancia de Router.
const router = Router();

// Endpoints.
router.post('/login', session.login);
router.post('/register', session.register);
router.post('/logout', session.logout);

export default router;