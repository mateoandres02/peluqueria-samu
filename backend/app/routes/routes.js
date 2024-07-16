// Importamos express para usar su Router
import { Router } from "express";

// Importamos los métodos de cada controlador.
import actionsUsers from '../controllers/users.controller.js';
import actionsTurns from '../controllers/turns.controller.js';

// Iniciamos el router.
const router = Router();

// Rutas para la tabla Oficinas
router.get("/users", actionsUsers.getAllUsers);
router.get("/users/:id", actionsUsers.getByIdUser);
router.post("/users", actionsUsers.postUser);
router.put("/users/:id", actionsUsers.updateUser);
router.delete("/users/:id", actionsUsers.deleteUser);

// Rutas para la tabla Empleados
router.get("/turns", actionsTurns.getAllTurns);
router.get("/turns/:id", actionsTurns.getByIdTurn);
router.post("/turns", actionsTurns.postTurn);
router.put("/turns/:id", actionsTurns.updateTurn);
router.delete("/turns/:id", actionsTurns.deleteTurn);

const routes = (app) => {
    app.use('/api', router);
}

// Exportamos el router
export default routes;
