import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function protect(req, res, next) {
  try {
    const header = req.headers.authorization;

    if (!header?.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const token = header.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    next();
  } catch {
    res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}


/* 
   Allows both logged-in users and guests.

   If a valid JWT exists:
   → req.user is populated
   → search history can be saved

   If no JWT exists:
   → guest can still search weather
*/
export async function optionalProtect(req, res, next) {
  try {
    const header = req.headers.authorization;

    // Guest user
    if (!header?.startsWith("Bearer ")) {
      return next();
    }

    const token = header.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(decoded.id).select("-password");

    if (user) {
      req.user = user;
    }

    next();
  } catch {
    // Invalid/expired token should not block public weather search
    next();
  }
}


export function adminOnly(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({
      message: "Admin access required",
    });
  }

  next();
}