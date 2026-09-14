import express from "express";

import {
    getWeather,
    getWeatherByCoordinates,
    getNearbyCities,
} from "../controllers/weatherController.js";

import { optionalProtect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public weather routes
// Guests can use them, and logged-in users can have their
// searches saved to history.

router.get(
    "/nearby",
    optionalProtect,
    getNearbyCities
);

router.get(
    "/city/:city",
    optionalProtect,
    getWeather
);

router.get(
    "/coordinates",
    optionalProtect,
    getWeatherByCoordinates
);

export default router;