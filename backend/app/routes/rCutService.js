import { Router } from "express";
import cCutService from "../controllers/cCutService.js";

const router = Router();

router.get("/cutservices", cCutService.getAllCutServices);
router.get("/cutservices/:id", cCutService.getServiceById);
router.post("/cutservices", cCutService.postCutService);
router.put("/cutservices/:id", cCutService.updateCutService);
router.delete("/cutservices/:id", cCutService.deleteCutService);

export default router;