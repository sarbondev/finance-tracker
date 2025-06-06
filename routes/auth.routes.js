import { Router } from "express";
import {
  register,
  login,
  verifyEmail,
} from "../controllers/auth.controller.js";
const router = Router();

router.post("/signup", register);
router.post("/login", login);
router.post("/verify-email", verifyEmail);

export default router;
