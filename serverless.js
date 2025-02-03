import express from "express";
import cors from "cors";
import authRoutes from "./api/auth/index.js"; // Adjust path if needed

const app = express();

app.use(
  cors({
    origin: "*",
    methods: "GET,POST,OPTIONS",
    allowedHeaders: "Content-Type,Authorization",
  })
);

app.use(express.json());
app.use("/api/auth", authRoutes);

export default app;
