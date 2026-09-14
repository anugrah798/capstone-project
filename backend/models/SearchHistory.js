import mongoose from "mongoose";

const searchHistorySchema = new mongoose.Schema(
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

    temperature: {
      type: Number,
      required: true,
    },

    condition: {
      type: String,
      required: true,
    },

    humidity: {
      type: Number,
      default: 0,
    },

    windSpeed: {
      type: Number,
      default: 0,
    },

    rainProbability: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "SearchHistory",
  searchHistorySchema
);