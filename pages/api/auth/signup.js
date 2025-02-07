import connectDB from "../../../utils/connectDB.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../../model/User.js";
import sendVerificationEmail from "../../../utils/emailSender";
console.log("🛠 MONGO_URI:", process.env.MONGO_URI);

export default async function handler(req, res) {
  console.log("🚀 API Route hit with method:", req.method);

  if (req.method !== "POST") {
    console.log("❌ Invalid request method:", req.method);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  console.log("🔄 Connecting to DB...");
  try {
    await connectDB();
    console.log("✅ Database connected.");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    return res.status(500).json({ error: "Database connection failed" });
  }

  console.log("📩 Received request body:", req.body);

  const { accountEmail, password } = req.body;

  if (!accountEmail || !password) {
    console.error("❌ Missing required fields");
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    console.log("🔍 Checking if user exists...");
    const existingUser = await User.findOne({ accountEmail });

    if (existingUser) {
      console.log("❌ User already exists.");
      return res.status(400).json({ error: "User already exists" });
    }

    console.log("🔐 Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("🆕 Creating new user...");
    const newUser = new User({
      accountEmail,
      password: hashedPassword,
      isVerified: false,
    });

    await newUser.save();
    console.log("✅ User saved to DB");

    console.log("📧 Sending verification email...");
    const token = jwt.sign(
      { id: newUser._id, email: newUser.accountEmail },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    console.log("✅ User created successfully in database:", newUser);
    await sendVerificationEmail(newUser.accountEmail, token);
    console.log("✅ Verification email sent");

    return res
      .status(201)
      .json({ message: "User registered. Please verify your email!" });
  } catch (error) {
    console.error("❌ Signup error:", error);
    return res.status(500).json({ error: "Failed to register user." });
  }
}
