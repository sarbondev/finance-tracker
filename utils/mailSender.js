import nodemailer from "nodemailer";

export const sendVerificationEmail = async (email, code) => {
  try {
    console.log("Attempting to send email to:", email);
    console.log("Email config check:", {
      user: process.env.EMAIL_USER,
      passLength: process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 0,
    });

    // Gmail uchun to'g'ri konfiguratsiya
    const transporter = nodemailer.createTransport({
      service: "gmail", // Gmail service ishlatish
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Bu App Password bo'lishi kerak
      },
    });

    // SMTP ulanishini tekshirish
    await transporter.verify();
    console.log("SMTP connection verified successfully");

    const mailOptions = {
      from: `"Finance Tracker" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Tasdiqlash kodi - Finance Tracker",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #333;">Email Tasdiqlash</h2>
          <p>Hurmatli foydalanuvchi,</p>
          <p>Finance Tracker ilovasida ro'yxatdan o'tganingiz uchun rahmat. Hisobingizni tasdiqlash uchun quyidagi kodni kiriting:</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 4px; text-align: center; margin: 20px 0;">
            <h1 style="color: #007bff; font-size: 32px; letter-spacing: 5px; margin: 0;">${code}</h1>
          </div>
          <p>Bu kod 10 daqiqa davomida amal qiladi.</p>
          <p>Agar siz ro'yxatdan o'tmagan bo'lsangiz, ushbu xabarni e'tiborsiz qoldiring.</p>
          <p style="margin-top: 20px; font-size: 12px; color: #777;">Bu avtomatik xabar, iltimos javob bermang.</p>
        </div>
      `,
      text: `Sizning tasdiqlash kodingiz: ${code}. Bu kod 10 daqiqa davomida amal qiladi.`,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", result.messageId);
    return result;
  } catch (error) {
    console.error("Email sending error:", error.message);
    throw error;
  }
};

// Test uchun email yuborish funksiyasi
export const testEmailConnection = async () => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.verify();
    console.log("✅ Email connection test successful");
    return true;
  } catch (error) {
    console.error("❌ Email connection test failed:", error.message);
    return false;
  }
};
