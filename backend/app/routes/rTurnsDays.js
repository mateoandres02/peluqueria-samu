import { Router } from "express";
import cTurnsDays from '../controllers/cTurnsDays.js';

const router = Router();

router.get("/recurrent_turns/:idUserActive", cTurnsDays.getAllRecurrentTurnsDaysByBarber);
// router.get("/turns/barber/:idUserActive", cTurn.getAllTurnsByBarber);
// router.get("/turns/:date", cTurn.getAllTurnsByDate);
// router.get("/turns/:date/:idUserActive", cTurn.getAllTurnsByDateAndBarber);
// router.get("/turns/:id", cTurn.getTurnById);
router.post("/recurrent_turns", cTurnsDays.postTurnDay);
// router.put("/turns/:id", cTurn.updateTurn);
// router.delete("/turns/:id", cTurn.deleteTurn);

export default router;
