import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    city: { type: String, required: true },
    latitude: Number,
    longitude: Number,
    country: String
  },
  { timestamps: true }
);

favoriteSchema.index({ userId: 1, city: 1 }, { unique: true });

export default mongoose.model("Favorite", favoriteSchema);