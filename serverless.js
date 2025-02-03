import { createRouter } from "next-connect";
import cors from "cors";
import authRoutes from "./api/auth/index.js";
import dotenv from "dotenv";
dotenv.config();
const router = createRouter();

router.use(cors());

router.use(authRoutes);

export default router.handler();
