import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { suggestion, chat } from "../controllers/aiController.js";

const router = express.Router();
router.use(protect);
router.post("/suggestion", suggestion);
router.post("/chat", chat);
export default router;