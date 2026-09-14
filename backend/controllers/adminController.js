import User from "../models/User.js";
import SearchHistory from "../models/SearchHistory.js";
import Favorite from "../models/Favorite.js";
import Alert from "../models/Alert.js";

export async function dashboard(req, res) {
  const [users, searches, favorites, alerts] = await Promise.all([
    User.countDocuments(),
    SearchHistory.countDocuments(),
    Favorite.countDocuments(),
    Alert.countDocuments()
  ]);
  res.json({ stats: { users, searches, favorites, alerts } });
}

export async function users(req, res) {
  const data = await User.find().select("-password").sort({ createdAt: -1 });
  res.json({ users: data });
}

export async function deleteUser(req, res) {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
}

export async function listAlerts(req, res) {
  res.json({ alerts: await Alert.find().sort({ createdAt: -1 }) });
}

export async function createAlert(req, res) {
  const alert = await Alert.create({ ...req.body, createdBy: req.user._id });
  res.status(201).json({ alert });
}

export async function deleteAlert(req, res) {
  await Alert.findByIdAndDelete(req.params.id);
  res.json({ message: "Alert deleted" });
}