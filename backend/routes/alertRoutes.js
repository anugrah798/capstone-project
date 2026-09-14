import express from "express";

import { protect } from "../middleware/authMiddleware.js";

import {
    getAlerts,
    createAlert,
    markAlertRead,
    deleteAlert,
    clearAlerts,
} from "../controllers/alertController.js";

const router = express.Router();

router.use(protect);

// Get all alerts
router.get("/", getAlerts);

// Create alert
router.post("/", createAlert);

// Mark one alert as read
router.put("/:id/read", markAlertRead);

// Delete one alert
router.delete("/:id", deleteAlert);

// Clear all alerts
router.delete("/", clearAlerts);

export default router;