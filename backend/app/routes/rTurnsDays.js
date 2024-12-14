import { Router } from "express";
import cTurnsDays from '../controllers/cTurnsDays.js';

const router = Router();

router.get("/recurrent_turns", cTurnsDays.getAllRecurrentTurns)
router.get("/recurrent_turns/turn/:id", cTurnsDays.getRecurrentTurnById)
router.get("/recurrent_turns/:idUserActive", cTurnsDays.getAllRecurrentTurnsDaysByBarber);
router.post("/recurrent_turns", cTurnsDays.postTurnRecurrentDay);
router.delete("/recurrent_turns/turn/:id/:date", cTurnsDays.deleteTurnOfRecurrentTurns);

export default router;
