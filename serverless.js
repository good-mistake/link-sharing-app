import { createRouter } from "next-connect";
import cors from "cors";
import authRoutes from "./api/auth/index.js";
import uploadRoute from "./api/upload.js";
import dotenv from "dotenv";

dotenv.config();
const router = createRouter();

router.use(cors());
router.use(authRoutes);
router.use("/api/upload", uploadRoute);
export default router.handler();
