import nodemailer from "nodemailer";

export const sendVerificationEmail = async (email, code) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Tasdiqlash kodi",
    text: `Sizning tasdiqlash kodingiz: ${code}`,
  };

  await transporter.sendMail(mailOptions);
};
