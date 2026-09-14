import Favorite from "../models/Favorite.js";

export async function listFavorites(req, res) {
  res.json({ favorites: await Favorite.find({ userId: req.user._id }).sort({ createdAt: -1 }) });
}

export async function addFavorite(req, res) {
  try {
    const { city, latitude, longitude, country } = req.body;
    const favorite = await Favorite.create({ userId: req.user._id, city, latitude, longitude, country });
    res.status(201).json({ favorite });
  } catch (e) {
    res.status(400).json({ message: e.code === 11000 ? "City already in favorites" : e.message });
  }
}

export async function removeFavorite(req, res) {
  await Favorite.deleteOne({ _id: req.params.id, userId: req.user._id });
  res.json({ message: "Favorite removed" });
}