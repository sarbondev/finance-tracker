import { Router } from "express";
import { register, login } from "../controllers/auth.controller.js";
const router = Router();

router.post("/signup", register);
router.post("/login", login);

export default router;
