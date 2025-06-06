import mongoose, { Schema } from "mongoose";

const ExpenseSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  note: { type: String },
  date: { type: Date, default: Date.now },
});

export default mongoose.model("Expense", ExpenseSchema);
