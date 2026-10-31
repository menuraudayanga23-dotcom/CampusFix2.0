import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import connectDatabase from "./config/db.js";
import User from "./models/User.js";

dotenv.config();

const createUser = async (name, email, password, role) => {
  const passwordHash = await bcrypt.hash(password, 12);

  const user = await User.findOneAndUpdate(
    { email },
    {
      name,
      email,
      passwordHash,
      role
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true
    }
  );

  console.log(`${role} account ready: ${user.email}`);
};

const seed = async () => {
  await connectDatabase();

  await createUser(
    "Campus Student",
    "student@campusfix.com",
    "Student123!",
    "student"
  );

  await createUser(
    "Campus Administrator",
    "admin@campusfix.com",
    "Admin123!",
    "administrator"
  );

  process.exit(0);
};

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
