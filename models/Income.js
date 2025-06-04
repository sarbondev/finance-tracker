import mongoose from "mongoose";

const IncomeSchema = new mongoose.Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  amount: Number,
  source: String,
  note: String,
  date: { type: Date, default: Date.now },
});

export default mongoose.model("Income", IncomeSchema);
