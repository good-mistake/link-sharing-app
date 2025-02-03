import express from "express";
import cors from "cors";
import authRoutes from "./api/auth/index.js";

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use("/api/auth", authRoutes);

const handler = (req, res) => app(req, res);

export default handler;
