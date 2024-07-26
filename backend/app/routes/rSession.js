// Importamos el módulo router de express.
import { Router } from "express";

// Importamos los métodos del controlador.
import session from "../controllers/cSession.js";

import { isAdmin, verifyToken } from "../middlewares/auth.js";

// Iniciamos una nueva instancia de Router.
const router = Router();

// Endpoints.
router.post('/login', session.login);
router.post('/register', session.register);
router.post('/logout', session.logout);
// router.get("/protected", verifyToken, isAdmin, session.routeProtected);
// router.get("/notprotected", verifyToken, session.routeNotProtected);

export default router;