import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

const PendingUserSchema = new Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    verificationCode: { type: String, required: true },
    expiresAt: { type: Date, default: Date.now, expires: 600 }, // 10 daqiqada o'chadi
  },
  { timestamps: true }
);

PendingUserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

export default mongoose.model("PendingUser", PendingUserSchema);
