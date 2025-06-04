import express, { json } from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import dotenv from "dotenv";

import AuthRoutes from "./routes/auth.routes.js";
import TransactionRoutes from "./routes/transaction.routes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(json());

connectDB();

app.get("/", (req, res) => res.send("Home route is working!"));
app.use("/api/auth", AuthRoutes);
app.use("/api/transactions", TransactionRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server ishga tushdi → http://localhost:${PORT}`)
);
