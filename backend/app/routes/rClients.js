import { Router } from "express";
import cClients from "../controllers/cClients.js";

const router = Router();

router.get("/clients", cClients.getAllClients);
router.get("/clients/:id", cClients.getClientById);
router.post("/clients", cClients.postClient);
router.put("/clients/:id", cClients.updateClient);
router.delete("/clients/:id", cClients.deleteClient);

export default router;