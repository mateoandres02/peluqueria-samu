// Importamos express para usar su Router
import { Router } from "express";

// Importamos los métodos del controlador.
import cUser from '../controllers/cUser-drizzle.js';

// Iniciamos el router.
const router = Router();

// Rutas para la tabla Usuarios
router.get("/users", cUser.getAllUsers);
router.get("/users/:id", cUser.getByIdUser);
router.post("/users", cUser.postUser);
router.put("/users/:id", cUser.updateUser);
router.delete("/users/:id", cUser.deleteUser);

// Exportamos el router
export default router;