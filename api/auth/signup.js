import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../model/User";
import sendVerificationEmail from "../../utils/emailSender";
import connectDB from "../../utils/connectDB";
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  await connectDB();

  const { accountEmail, password } = req.body;

  if (!accountEmail || !password) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const existingUser = await User.findOne({ accountEmail });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      accountEmail,
      password: hashedPassword,
    });

    await newUser.save();

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
