import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../model/User";
import sendVerificationEmail from "../../utils/emailSender";
import cors from "cors";

const router = express.Router();
router.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  next();
});
router.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,OPTIONS",
    allowedHeaders: "Content-Type, Authorization",
  })
);
router.post("/signup", async (req, res) => {
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
});
export default router;
