import { Router } from "express";
import {
  createIncome,
  getIncomes,
  getIncomeById,
  updateIncome,
  deleteIncome,
} from "../controllers/income.controller.js";
import auth from "../middlewares/isAuth.js";

const router = Router();

router.use(auth);

router.post("/", createIncome);
router.get("/", getIncomes);
router.get("/:id", getIncomeById);
router.put("/:id", updateIncome);
router.delete("/:id", deleteIncome);

export default router;
