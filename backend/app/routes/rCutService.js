import { Router } from "express";
import cCutService from "../controllers/cCutServices.js";

const router = Router();

router.get("/cutservices", cCutService.getAllCutServices);
router.post("/cutservices/:id", cCutService.postCutService);
router.put("/cutservices/:id", cCutService.updateCutService);
router.delete("/cutservices/:id", cCutService.deleteCutService);

export default router;