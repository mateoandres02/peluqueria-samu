import { Router } from "express";
import cTurn from '../controllers/cTurn.js';

const router = Router();

router.get("/turns", cTurn.getAllTurns);
router.get("/turns/barber/:idUserActive", cTurn.getAllTurnsByBarber);
router.get("/turns/:id", cTurn.getTurnById);
router.post("/turns", cTurn.postTurn);
router.put("/turns/:id", cTurn.updateTurn);
router.delete("/turns/:id", cTurn.deleteTurn);

export default router;
