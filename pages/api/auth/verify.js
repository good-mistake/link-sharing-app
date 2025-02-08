import jwt from "jsonwebtoken";
import User from "../../../model/User.js";
import connectDB from "../../../utils/connectDB.js";

export default async function handler(req, res) {
  await connectDB();

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ error: "Token is required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.isVerified) {
      return res.status(200).json({ message: "Email is already verified." });
    }

    user.isVerified = true;
    await user.save();

    return res.status(200).json({ message: "Email Verified Successfully!" });
  } catch (err) {
    console.error("Verification Error:", err);
    return res.status(400).json({ error: "Invalid or expired token." });
  }
}
