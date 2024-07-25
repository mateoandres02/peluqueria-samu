// Importamos express para usar su Router
import { Router } from "express";

// Importamos los métodos del controlador.
import cTurn from '../controllers/cTurn.js';

// Iniciamos el router.
const router = Router();

// Rutas para la tabla Turnos
router.get("/turns", cTurn.getAllTurns);
router.get("/turns/:id", cTurn.getByIdTurn);
router.post("/turns", cTurn.postTurn);
router.put("/turns/:id", cTurn.updateTurn);
router.delete("/turns/:id", cTurn.deleteTurn);

// Exportamos el router
export default router;
