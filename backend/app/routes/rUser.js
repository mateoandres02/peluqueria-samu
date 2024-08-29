import { Router } from "express";
import cUser from '../controllers/cUser-drizzle.js';

const router = Router();

router.get("/users", cUser.getAllUsers);
router.get("/users/:id", cUser.getByIdUser);
router.post("/users", cUser.postUser);
router.put("/users/:id", cUser.updateUser);
router.delete("/users/:id", cUser.deleteUser);

export default router;