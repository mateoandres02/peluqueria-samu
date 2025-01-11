import { Router } from "express";
import cVoucher from "../controllers/cVoucher.js";

const router = Router();

router.get("/vouchers", cVoucher.getAllVouchers);
router.get("/vouchers/:id", cVoucher.getVoucherById);
router.get("/vouchers/params/barber/:barberName", cVoucher.getVouchersByBarber);
router.get("/vouchers/params/:date", cVoucher.getVouchersByDate);
router.get("/vouchers/params/:date/:barberName", cVoucher.getVouchersByDateAndBarber);
router.post("/vouchers", cVoucher.postVoucher);
router.delete("/vouchers/:id", cVoucher.deleteVoucher);
router.put("/vouchers/:id", cVoucher.updateVoucher);

export default router;