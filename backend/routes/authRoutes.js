import express from "express";

import {
    register,
    login,
    me,
    updateProfile,
    changePassword,
    getAlertPreferences,
    updateAlertPreferences,
    forgotPassword,
    verifyResetOtp,
    resetPassword,
} from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// =========================================
// AUTH
// =========================================

router.post("/register", register);

router.post("/login", login);

router.post("/forgot-password", forgotPassword);

router.post("/verify-reset-otp", verifyResetOtp);

router.post("/reset-password", resetPassword);

router.get("/me", protect, me);

// =========================================
// PROFILE
// =========================================

router.put(
    "/profile",
    protect,
    updateProfile
);

router.put(
    "/profile/password",
    protect,
    changePassword
);

// =========================================
// WEATHER ALERT PREFERENCES
// =========================================

router.get(
    "/alert-preferences",
    protect,
    getAlertPreferences
);

router.put(
    "/alert-preferences",
    protect,
    updateAlertPreferences
);

export default router;