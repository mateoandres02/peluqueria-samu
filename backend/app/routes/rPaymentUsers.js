import { Router } from "express";
import cPaymentUsers from "../controllers/cPaymentUsers.js";

const router = Router();

router.get("/paymentusers", cPaymentUsers.getAllPaymentUsers);
router.get("/paymentusers/:id", cPaymentUsers.getPaymentUsersById);
router.post("/paymentusers", cPaymentUsers.postPaymentUsers);
router.put("/paymentusers/:id_usuario/:id_servicio", cPaymentUsers.updatePaymentUsers);
router.delete("/paymentusers/:id", cPaymentUsers.deletePaymentUsers);

export default router;