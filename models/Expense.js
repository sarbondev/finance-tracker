import mongoose from "mongoose";

const ExpenseSchema = new mongoose.Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  amount: Number,
  category: String,
  note: String,
  date: { type: Date, default: Date.now },
});

export default mongoose.model("Expense", ExpenseSchema);
