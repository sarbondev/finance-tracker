import { connect } from "mongoose";
const connectDB = async () => {
  try {
    await connect(process.env.MONGO_URI);
    console.log("MongoDB ulandi ✅");
  } catch (err) {
    console.error("MongoDB ulanishda xatolik ❌", err.message);
    process.exit(1);
  }
};
export default connectDB;
