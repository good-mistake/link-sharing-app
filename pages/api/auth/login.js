import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../../model/User.js";
import connectDB from "../../../utils/connectDB.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    await connectDB();

    const { accountEmail, password } = req.body;
    const user = await User.findOne({ accountEmail });
    console.log("User found:", user);
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    console.log("User verification status:", user.isVerified);
    if (!user.isVerified) {
      return res.status(403).json({
        error: `${user.isVerified} Account not verified. Please verify your email.`,
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.accountEmail },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: "Server error" });
  }
}
