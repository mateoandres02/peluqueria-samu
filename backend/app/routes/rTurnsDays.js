import { Router } from "express";
import cTurnsDays from '../controllers/cTurnsDays.js';

const router = Router();

router.get("/recurrent_turns", cTurnsDays.getAllRecurrentTurns)
router.get("/recurrent_turns/turn/:id", cTurnsDays.getRecurrentTurnById)
router.get("/recurrent_turns/:idUserActive", cTurnsDays.getAllRecurrentTurnsDaysByBarber);
router.get("/recurrent_turns/turn/date/:date", cTurnsDays.getAllRecurrentTurnsDaysByDate);
router.get("/recurrent_turns/:idUserActive/:date", cTurnsDays.getAllRecurrentTurnsByDateAndBarber);
router.get("/recurrent_turns/week/:startWeek/:endWeek", cTurnsDays.getAllTurnsByWeek);
router.get("/recurrent_turns/week/:startWeek/:endWeek/:barberId", cTurnsDays.getAllTurnsByWeekAndBarber);
router.post("/recurrent_turns", cTurnsDays.postTurnRecurrentDay);
router.delete("/recurrent_turns/turn/:id/:date", cTurnsDays.deleteTurnOfRecurrentTurns);

export default router;
