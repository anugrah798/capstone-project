import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";

import User from "../models/User.js";
import PasswordReset from "../models/PasswordReset.js";

function tokenFor(user) {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

export async function register(req, res) {
  try {
    const {
      name,
      email,
      password
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message:
          "Password must be at least 6 characters"
      });
    }

    const exists =
      await User.findOne({ email });

    if (exists) {
      return res.status(409).json({
        message: "Email already registered"
      });
    }

    const hashed =
      await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed
    });

    res.status(201).json({
      token: tokenFor(user),

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (e) {
    res.status(500).json({
      message: e.message
    });
  }
}


export async function login(req, res) {
  try {
    const {
      email,
      password
    } = req.body;

    const user =
      await User.findOne({ email });

    if (
      !user ||
      !(await bcrypt.compare(
        password,
        user.password
      ))
    ) {
      return res.status(401).json({
        message:
          "Invalid email or password"
      });
    }

    res.json({
      token: tokenFor(user),

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (e) {
    res.status(500).json({
      message: e.message
    });
  }
}


export async function me(req, res) {
  res.json({
    user: req.user
  });
}


export async function updateProfile(req, res) {
  try {
    const { name, preferredCity } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Name is required",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.name = name.trim();
    user.preferredCity = preferredCity?.trim() || "";

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        preferredCity: user.preferredCity,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);

    res.status(500).json({
      message: "Unable to update profile",
    });
  }
}


export async function changePassword(req, res) {
  try {
    const {
      currentPassword,
      newPassword,
    } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message:
          "Current password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message:
          "New password must contain at least 6 characters",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const passwordCorrect =
      await bcrypt.compare(
        currentPassword,
        user.password
      );

    if (!passwordCorrect) {
      return res.status(401).json({
        message: "Current password is incorrect",
      });
    }

    const samePassword =
      await bcrypt.compare(
        newPassword,
        user.password
      );

    if (samePassword) {
      return res.status(400).json({
        message:
          "New password must be different from your current password",
      });
    }

    user.password =
      await bcrypt.hash(newPassword, 10);

    await user.save();

    res.json({
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error(
      "Change password error:",
      error
    );

    res.status(500).json({
      message: "Unable to change password",
    });
  }
}
// =========================================
// GET ALERT PREFERENCES
// =========================================

export async function getAlertPreferences(
  req,
  res
) {
  try {
    const user =
      await User.findById(
        req.user._id
      ).select("alertPreferences");

    res.json({
      alertPreferences:
        user?.alertPreferences || {
          rain: true,
          temperature: true,
          uv: true,
          wind: true,
          thunderstorm: true
        }
    });

  } catch (e) {
    res.status(500).json({
      message:
        "Unable to load alert preferences"
    });
  }
}


// =========================================
// UPDATE ALERT PREFERENCES
// =========================================

export async function updateAlertPreferences(
  req,
  res
) {
  try {
    const {
      alertPreferences
    } = req.body;

    if (!alertPreferences) {
      return res.status(400).json({
        message:
          "Alert preferences are required"
      });
    }

    const updatedUser =
      await User.findByIdAndUpdate(
        req.user._id,

        {
          $set: {
            alertPreferences: {
              rain:
                alertPreferences.rain !== false,

              temperature:
                alertPreferences.temperature !== false,

              uv:
                alertPreferences.uv !== false,

              wind:
                alertPreferences.wind !== false,

              thunderstorm:
                alertPreferences.thunderstorm !== false
            }
          }
        },

        { new: true }
      ).select("alertPreferences");

    res.json({
      message:
        "Alert preferences updated",

      alertPreferences:
        updatedUser.alertPreferences
    });

  } catch (e) {
    res.status(500).json({
      message:
        "Unable to update alert preferences"
    });
  }
}


export async function forgotPassword(req, res) {
  try {
    const email = req.body.email?.trim().toLowerCase();

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "No account found with this email",
      });
    }

    const otp = crypto.randomInt(100000, 1000000).toString();

    const expiresAt = new Date(
      Date.now() + 10 * 60 * 1000
    );

    await PasswordReset.deleteMany({ email });

    await PasswordReset.create({
      email,
      otp,
      expiresAt,
    });

    await transporter.sendMail({
      from: `"SkySense AI" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "SkySense AI - Password Reset OTP",
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>☁️ SkySense AI</h2>
          <p>Your password reset verification code is:</p>

          <h1 style="letter-spacing: 6px;">
            ${otp}
          </h1>

          <p>This OTP is valid for <strong>10 minutes</strong>.</p>

          <p>If you did not request a password reset, please ignore this email.</p>
        </div>
      `,
    });

    res.json({
      message: "Verification code sent to your email",
    });
  } catch (error) {
    console.error("Forgot password error:", error);

    res.status(500).json({
      message: "Unable to send verification code",
    });
  }
}

export async function verifyResetOtp(req, res) {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const otp = req.body.otp?.trim();

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required",
      });
    }

    const resetRequest = await PasswordReset.findOne({
      email,
      otp,
    });

    if (!resetRequest) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    if (resetRequest.expiresAt < new Date()) {
      await PasswordReset.deleteOne({
        _id: resetRequest._id,
      });

      return res.status(400).json({
        message: "OTP has expired",
      });
    }

    resetRequest.verified = true;

    await resetRequest.save();

    res.json({
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.error("Verify OTP error:", error);

    res.status(500).json({
      message: "Unable to verify OTP",
    });
  }
}


export async function resetPassword(req, res) {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const newPassword = req.body.newPassword;

    if (!email || !newPassword) {
      return res.status(400).json({
        message: "Email and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const resetRequest = await PasswordReset.findOne({
      email,
      verified: true,
    });

    if (!resetRequest) {
      return res.status(400).json({
        message: "Please verify the OTP first",
      });
    }

    if (resetRequest.expiresAt < new Date()) {
      await PasswordReset.deleteOne({
        _id: resetRequest._id,
      });

      return res.status(400).json({
        message: "OTP has expired",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const samePassword = await bcrypt.compare(
      newPassword,
      user.password
    );

    if (samePassword) {
      return res.status(400).json({
        message: "New password must be different from your old password",
      });
    }

    user.password = await bcrypt.hash(
      newPassword,
      10
    );

    await user.save();

    await PasswordReset.deleteMany({ email });

    res.json({
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Reset password error:", error);

    res.status(500).json({
      message: "Unable to reset password",
    });
  }
}