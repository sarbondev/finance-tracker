import { Router } from "express";
import {
  getDashboardStats,
  getMonthlyReport,
  getCategoryBreakdown,
  getYearlyReport,
} from "../controllers/analytics.controller.js";
import auth from "../middlewares/isAuth.js";

const router = Router();

router.use(auth);

router.get("/dashboard", getDashboardStats);
router.get("/monthly/:year/:month", getMonthlyReport);
router.get("/yearly/:year", getYearlyReport);
router.get("/categories", getCategoryBreakdown);

export default router;
