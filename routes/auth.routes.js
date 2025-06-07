import { Router } from "express";
import {
  register,
  login,
  verifyEmail,
  resendVerificationCode,
  testEmail,
} from "../controllers/auth.controller.js";

const router = Router();

router.post("/signup", register);
router.post("/login", login);
router.post("/verify-email", verifyEmail);
router.post("/resend-code", resendVerificationCode);
router.get("/test-email", testEmail); // Email ulanishini test qilish

export default router;
