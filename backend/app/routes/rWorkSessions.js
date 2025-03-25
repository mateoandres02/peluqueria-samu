import { Router } from "express";
import cWorkSessions from "../controllers/cWorkSession.js"

const router = Router();

router.get("/worksessions", cWorkSessions.getAllSessions);
router.get("/worksessions/:date", cWorkSessions.getAllSessionsByDate);
router.post("/worksessions", cWorkSessions.postSession);
router.delete("/worksessions/:id", cWorkSessions.deleteWorkSession);
router.put("/worksessions/:id", cWorkSessions.updateSession)

export default router;