import User from "../models/User.js";
import PendingUser from "../models/PendingUser.js";
import jwt from "jsonwebtoken";
import {
  sendVerificationEmail,
  testEmailConnection,
} from "../utils/mailSender.js";

export const register = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    // Input validation
    if (!fullName || !email || !password) {
      return res
        .status(400)
        .json({ message: "Barcha maydonlar to'ldirilishi shart" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Parol kamida 6 ta belgidan iborat bo'lishi kerak" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Email formati noto'g'ri" });
    }

    // Mavjud foydalanuvchilarni tekshirish
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Bu email allaqachon ro'yxatdan o'tgan" });
    }

    // Kutilayotgan foydalanuvchilarni tekshirish
    const existingPendingUser = await PendingUser.findOne({ email });
    if (existingPendingUser) {
      await PendingUser.deleteOne({ email });
    }

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // Vaqtinchalik foydalanuvchi yaratish
    const pendingUser = new PendingUser({
      fullName,
      email,
      password,
      verificationCode,
    });

    await pendingUser.save();
    console.log("Pending user created successfully");

    // Email yuborish
    try {
      await sendVerificationEmail(email, verificationCode);
      res.status(201).json({
        message: "Tasdiqlash kodi emailga yuborildi. Kodni kiriting.",
        email: email,
      });
    } catch (emailError) {
      console.error("Email sending failed:", emailError.message);

      // Development rejimida kodni ko'rsatish
      if (process.env.NODE_ENV === "development") {
        res.status(201).json({
          message:
            "Email yuborishda xatolik. Development rejimida kod: " +
            verificationCode,
          email: email,
          verificationCode: verificationCode,
          emailError: "Gmail App Password sozlanmagan",
        });
      } else {
        res.status(500).json({
          message:
            "Email yuborishda xatolik. Iltimos, keyinroq urinib ko'ring.",
        });
      }
    }
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Serverda xatolik yuz berdi" });
  }
};

export const verifyEmail = async (req, res) => {
  const { email, code } = req.body;
  try {
    if (!email || !code) {
      return res
        .status(400)
        .json({ message: "Email va kod kiritilishi shart" });
    }

    const pendingUser = await PendingUser.findOne({ email });
    if (!pendingUser) {
      return res.status(400).json({
        message:
          "Tasdiqlash kodi topilmadi yoki muddati tugagan. Qaytadan ro'yxatdan o'ting.",
      });
    }

    if (pendingUser.verificationCode !== code.toString()) {
      return res.status(400).json({ message: "Tasdiqlash kodi noto'g'ri" });
    }

    // Haqiqiy foydalanuvchi yaratish
    const newUser = new User({
      fullName: pendingUser.fullName,
      email: pendingUser.email,
      password: pendingUser.password,
      isVerified: true,
    });

    // Parolni qayta hash qilmaslik uchun
    newUser.isModified = () => false;
    await newUser.save();

    // Kutilayotgan foydalanuvchini o'chirish
    await PendingUser.deleteOne({ email });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d", // 7 kunga uzaytirildi
    });

    res.json({
      token,
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
      },
      message: "Email muvaffaqiyatli tasdiqlandi va hisob yaratildi",
    });
  } catch (err) {
    console.error("Verify email error:", err);
    res.status(500).json({ message: "Serverda xatolik yuz berdi" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email va parol kiritilishi shart" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      const pendingUser = await PendingUser.findOne({ email });
      if (pendingUser) {
        return res.status(400).json({
          message: "Hisobingiz hali tasdiqlanmagan. Emaildagi kodni kiriting.",
          needsVerification: true,
          email: email,
        });
      }
      return res.status(400).json({ message: "Foydalanuvchi topilmadi" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Parol noto'g'ri" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
      message: "Muvaffaqiyatli login qilindi",
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Serverda xatolik yuz berdi" });
  }
};

export const resendVerificationCode = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) {
      return res.status(400).json({ message: "Email kiritilishi shart" });
    }

    const pendingUser = await PendingUser.findOne({ email });
    if (!pendingUser) {
      return res.status(400).json({
        message:
          "Kutilayotgan foydalanuvchi topilmadi. Qaytadan ro'yxatdan o'ting.",
      });
    }

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    pendingUser.verificationCode = verificationCode;
    pendingUser.expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 daqiqa
    await pendingUser.save();

    try {
      await sendVerificationEmail(email, verificationCode);
      res.json({ message: "Yangi tasdiqlash kodi emailga yuborildi" });
    } catch (emailError) {
      if (process.env.NODE_ENV === "development") {
        res.json({
          message:
            "Email yuborishda xatolik. Development rejimida kod: " +
            verificationCode,
          verificationCode: verificationCode,
        });
      } else {
        res.status(500).json({ message: "Email yuborishda xatolik" });
      }
    }
  } catch (err) {
    console.error("Resend code error:", err);
    res.status(500).json({ message: "Serverda xatolik yuz berdi" });
  }
};

export const testEmail = async (req, res) => {
  try {
    const isConnected = await testEmailConnection();
    if (isConnected) {
      res.json({ message: "Email ulanishi muvaffaqiyatli" });
    } else {
      res.status(500).json({ message: "Email ulanishida xatolik" });
    }
  } catch (err) {
    res.status(500).json({ message: "Email test xatoligi" });
  }
};

export const cleanupExpiredPendingUsers = async () => {
  try {
    const result = await PendingUser.deleteMany({
      expiresAt: { $lt: new Date() },
    });
    if (result.deletedCount > 0) {
      console.log(`Cleaned up ${result.deletedCount} expired pending users`);
    }
  } catch (err) {
    console.error("Cleanup error:", err);
  }
};
