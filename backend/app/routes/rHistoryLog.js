import { Router } from "express";
import cHistoryLog from "../controllers/cHistoryLog.js";

const router = Router();

router.get("/historyturns", cHistoryLog.getAllHistory);
router.get("/historyturns/barber/:barberName", cHistoryLog.getAllTurnsHistoryByBarber);
router.get("/historyturns/:date", cHistoryLog.getAllTurnsHistoryByDate);
router.get("/historyturns/:date/:barberName", cHistoryLog.getAllTurnsHistoryByDateAndBarber);
router.post("/historyturns", cHistoryLog.postTurnHistoryLog);
router.delete("/historyturns/:id", cHistoryLog.deleteHistoryTurn);

export default router;