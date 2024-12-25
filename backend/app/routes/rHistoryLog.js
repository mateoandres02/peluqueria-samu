import { Router } from "express";
import cHistoryLog from "../controllers/cHistoryLog.js";

const router = Router();

router.get("/historyturns", cHistoryLog.getAllHistory);
router.post("/historyturns", cHistoryLog.postTurnHistoryLog);
router.delete("/historyturns/:id", cHistoryLog.deleteHistoryTurn);

export default router;