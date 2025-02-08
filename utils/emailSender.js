import nodemailer from "nodemailer";

const sendVerificationEmail = async (email, token) => {
  console.log("📧 Setting up email transporter...");
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verify?token=${token}`;
  console.log("🔗 Verification URL:", verificationUrl);

  try {
    console.log("📨 Sending verification email...");
    await transporter.sendMail({
      from: `"Link Sharing App" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Verify Your Email",
      html: `<p>Click the link below to verify your email:</p>
             <a href="${verificationUrl}">${verificationUrl}</a>`,
    });
    console.log("✅ Verification email sent successfully!");
  } catch (error) {
    console.error("❌ Failed to send email:", error);
    throw new Error("Email sending failed");
  }
};

export default sendVerificationEmail;
