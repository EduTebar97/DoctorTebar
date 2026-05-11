import bcrypt from "bcrypt";
import { connectDB, disconnectDB } from "../config/db.js";
import { User } from "../models/User.model.js";

async function seedAdmin() {
  await connectDB();
  const email = "dr.tebar@gmail.com";
  const existing = await User.findOne({ email });
  if (existing) {
    console.log("Admin already exists");
    await disconnectDB();
    return;
  }
  await User.create({
    name: "Eduardo Tebar Boti",
    email,
    passwordHash: await bcrypt.hash("AdminPassword123!", 12),
    role: "admin",
    status: "active"
  });
  console.log("Admin created: dr.tebar@gmail.com / AdminPassword123!");
  await disconnectDB();
}

seedAdmin().catch((error) => {
  console.error(error);
  process.exit(1);
});
