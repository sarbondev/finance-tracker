import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { sendVerificationEmail } from "../utils/mailSender.js";

export const register = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res
        .status(400)
        .json({ message: "Email allaqachon ro'yxatdan o'tgan" });

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const newUser = new User({ fullName, email, password, verificationCode });
    await newUser.save();

    await sendVerificationEmail(email, verificationCode);

    res.status(201).json({
      message: "Foydalanuvchi yaratildi. Emailga tasdiqlash kodi yuborildi.",
    });
  } catch (err) {
    res.status(500).json({ message: "Serverda xatolik yuz berdi" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Foydalanuvchi topilmadi" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: "Parol noto'g'ri" });

    if (!user.isVerified) {
      const verificationCode = Math.floor(
        100000 + Math.random() * 900000
      ).toString();
      user.verificationCode = verificationCode;
      await user.save();
      await sendVerificationEmail(email, verificationCode);
      return res.status(400).json({
        message: "Email tasdiqlanmagan. Yangi tasdiqlash kodi yuborildi.",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Serverda xatolik yuz berdi" });
  }
};

export const verifyEmail = async (req, res) => {
  const { email, code } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Foydalanuvchi topilmadi" });

    if (user.verificationCode !== code)
      return res.status(400).json({ message: "Tasdiqlash kodi noto'g'ri" });

    user.isVerified = true;
    user.verificationCode = undefined;
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Serverda xatolik yuz berdi" });
  }
};
