import express from "express";

import {
    suggestion,
    chat,
} from "../controllers/aiController.js";

import {
    protect,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/suggestion", suggestion);
router.post("/chat", chat);

export default router;