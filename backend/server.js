import alertRoutes from "./routes/alertRoutes.js";
import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import weatherRoutes from "./routes/weatherRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";
import historyRoutes from "./routes/historyRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.get("/", (req, res) => res.json({ message: "Weather AI API is running" }));
app.use("/api/auth", authRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/admin", adminRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Server error" });
});

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
});