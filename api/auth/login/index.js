import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../../model/User";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { accountEmail, password } = req.body;

  try {
    const user = await User.findOne({ accountEmail });
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });
    if (!user.isVerified) {
      return res.status(400).json({ error: "Please verify your email first" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.accountEmail },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});
export default router;
