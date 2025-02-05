import express from "express";
import jwt from "jsonwebtoken";
import User from "../../../model/User.js";

const router = express.Router();

router.get("/verify", async (req, res) => {
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
});

export default router;
