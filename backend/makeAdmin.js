import "dotenv/config";
import bcrypt from "bcryptjs";
import { connectDB } from "./config/db.js";
import User from "./models/User.js";

await connectDB();
const email = process.argv[2];
const password = process.argv[3];
if (!email || !password) {
  console.log("Usage: node makeAdmin.js admin@email.com password");
  process.exit(0);
}
const user = await User.findOne({ email });
if (!user) {
  console.log("User not found. Register first, then run this command.");
} else {
  user.role = "admin";
  user.password = await bcrypt.hash(password, 10);
  await user.save();
  console.log(`${email} is now an admin.`);
}
process.exit(0);
