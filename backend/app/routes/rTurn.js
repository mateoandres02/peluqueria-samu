import { Router } from "express";
import cTurn from '../controllers/cTurn-drizzle.js';

const router = Router();

router.get("/turns", cTurn.getAllTurns);
router.get("/turns/:idUserActive", cTurn.getAllTurnsByBarber);
router.get("/turns/:id", cTurn.getByIdTurn);
router.post("/turns", cTurn.postTurn);
router.put("/turns/:id", cTurn.updateTurn);
router.delete("/turns/:id", cTurn.deleteTurn);

export default router;
