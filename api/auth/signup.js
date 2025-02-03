import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../model/User";
import sendVerificationEmail from "../../utils/emailSender";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { accountEmail, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      accountEmail,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: newUser._id, email: newUser.accountEmail },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    await sendVerificationEmail(newUser.accountEmail, token);
    res
      .status(201)
      .json({ message: "User registered. Please verify your email!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to register user." });
  }
}
