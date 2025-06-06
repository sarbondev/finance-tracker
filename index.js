import express, { json } from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import dotenv from "dotenv";

import AuthRoutes from "./routes/auth.routes.js";
import ExpenseRoutes from "./routes/expense.routes.js";
import IncomeRoutes from "./routes/income.routes.js";
import CategoryRoutes from "./routes/category.routes.js";
import AnalyticsRoutes from "./routes/analytics.routes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(json());

connectDB();

app.get("/", (req, res) =>
  res.send("Personal Finance Tracker API is running!")
);
app.use("/api/auth", AuthRoutes);
app.use("/api/expenses", ExpenseRoutes);
app.use("/api/incomes", IncomeRoutes);
app.use("/api/categories", CategoryRoutes);
app.use("/api/analytics", AnalyticsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server ishga tushdi → http://localhost:${PORT}`)
);
