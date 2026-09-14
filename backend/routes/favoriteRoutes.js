import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { listFavorites, addFavorite, removeFavorite } from "../controllers/favoriteController.js";

const router = express.Router();
router.use(protect);
router.get("/", listFavorites);
router.post("/", addFavorite);
router.delete("/:id", removeFavorite);
export default router;