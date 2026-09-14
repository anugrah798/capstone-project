import SearchHistory from "../models/SearchHistory.js";

export async function listHistory(req, res) {
  res.json({ history: await SearchHistory.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(50) });
}

export async function clearHistory(req, res) {
  await SearchHistory.deleteMany({ userId: req.user._id });
  res.json({ message: "History cleared" });
}

export async function deleteHistoryItem(req, res) {
  await SearchHistory.deleteOne({ _id: req.params.id, userId: req.user._id });
  res.json({ message: "History item deleted" });
}