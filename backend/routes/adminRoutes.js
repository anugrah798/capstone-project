import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { dashboard, users, deleteUser, listAlerts, createAlert, deleteAlert } from "../controllers/adminController.js";

const router = express.Router();
router.use(protect, adminOnly);
router.get("/dashboard", dashboard);
router.get("/users", users);
router.delete("/users/:id", deleteUser);
router.get("/alerts", listAlerts);
router.post("/alerts", createAlert);
router.delete("/alerts/:id", deleteAlert);
export default router;