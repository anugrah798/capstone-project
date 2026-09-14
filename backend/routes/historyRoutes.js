import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { listHistory, clearHistory, deleteHistoryItem } from "../controllers/historyController.js";

const router = express.Router();
router.use(protect);
router.get("/", listHistory);
router.delete("/", clearHistory);
router.delete("/:id", deleteHistoryItem);
export default router;