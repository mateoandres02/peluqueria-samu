import { Router } from "express";
import cTurn from '../controllers/cTurn.js';

const router = Router();

router.get("/turns", cTurn.getAllTurns);
router.get("/turns/barber/:idUserActive", cTurn.getAllTurnsByBarber);
router.get("/turns/:date", cTurn.getAllTurnsByDate);
router.get("/turns/:date/:idUserActive", cTurn.getAllTurnsByDateAndBarber);
router.get("/turns/:id", cTurn.getTurnById);
router.get("/turns/week/:startWeek/:endWeek", cTurn.getAllTurnsByWeek);
router.get("/turns/week/:startWeek/:endWeek/:barberId", cTurn.getAllTurnsByWeekAndBarber);
router.post("/turns", cTurn.postTurn);
router.put("/turns/:id", cTurn.updateTurn);
router.delete("/turns/:id/:date", cTurn.deleteTurn);

export default router;
