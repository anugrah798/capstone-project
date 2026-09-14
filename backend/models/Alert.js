import mongoose from "mongoose";

const alertSchema = new mongoose.Schema(
  {
    city: { type: String, required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    severity: { type: String, enum: ["info", "warning", "danger"], default: "warning" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

export default mongoose.model("Alert", alertSchema);