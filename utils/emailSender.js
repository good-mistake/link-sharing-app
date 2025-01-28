import nodemailer from "nodemailer";

const sendVerificationEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_PORT == 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verify?token=${token}`;

  await transporter.sendMail({
    from: `"Link Sharing App" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify Your Email",
    html: `<p>Click the link below to verify your email:</p>
           <a href="${verificationUrl}">${verificationUrl}</a>`,
  });
};

export default sendVerificationEmail;
