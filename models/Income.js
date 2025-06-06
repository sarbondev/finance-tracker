import mongoose, { Schema } from "mongoose";

const IncomeSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  source: { type: String, required: true },
  note: { type: String },
  date: { type: Date, default: Date.now },
});

export default mongoose.model("Income", IncomeSchema);
