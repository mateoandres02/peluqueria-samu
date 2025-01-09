import { Router } from "express";
import cVoucher from "../controllers/cVoucher.js";

const router = Router();

router.get("/vouchers", cVoucher.getAllVouchers);
router.post("/vouchers", cVoucher.postVoucher);
router.delete("/vouchers/:id", cVoucher.deleteVoucher);
router.put("/vouchers/:id", cVoucher.updateVoucher);

export default router;