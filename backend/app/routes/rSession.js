import { Router } from "express";
import session from "../controllers/cSession.js";

const router = Router();

router.post('/login', session.login);
router.post('/register', session.register);
router.post('/logout', session.logout);

export default router;