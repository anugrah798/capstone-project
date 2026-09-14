import mongoose from "mongoose";

const weatherAlertSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        city: {
            type: String,
            required: true,
        },

        type: {
            type: String,
            required: true,
        },

        message: {
            type: String,
            required: true,
        },

        severity: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "medium",
        },

        isRead: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model(
    "WeatherAlert",
    weatherAlertSchema
);