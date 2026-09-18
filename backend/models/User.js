import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },

    preferredCity: {
      type: String,
      default: ""
    },

    // ================================
    // PROFILE PHOTO
    // ================================

    profilePhoto: {
      type: String,
      default: ""
    },

    unit: {
      type: String,
      enum: ["C", "F"],
      default: "C"
    },

    // ================================
    // WEATHER ALERT PREFERENCES
    // ================================

    alertPreferences: {
      rain: {
        type: Boolean,
        default: true
      },

      temperature: {
        type: Boolean,
        default: true
      },

      uv: {
        type: Boolean,
        default: true
      },

      wind: {
        type: Boolean,
        default: true
      },

      thunderstorm: {
        type: Boolean,
        default: true
      }
    }
  },

  { timestamps: true }
);

export default mongoose.model("User", userSchema);