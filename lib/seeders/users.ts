import mongoose from "mongoose";
import { connectDB } from "../db/mongodb";
import User from "../db/models/User";

const usersToSeed = [
  {
    name: "John Doe",
    email: "john.doe@flights.com",
    password: "password123",
    role: "Admin",
    status: "active",
  },
  {
    name: "Jane Smith",
    email: "jane.smith@flights.com",
    password: "password123",
    role: "Manager",
    status: "active",
  },
  {
    name: "Mike Johnson",
    email: "mike.johnson@flights.com",
    password: "password123",
    role: "Operator",
    status: "inactive",
  },
];

const seedUsers = async () => {
  await connectDB();

  for (const user of usersToSeed) {
    const existingUser = await User.findOne({ email: user.email });
    if (existingUser) {
      console.log(`User with email ${user.email} already exists. Skipping.`);
      continue; // Skip this user if already exists
    }

    const newUser = new User({
      ...user,
      password: user.password,
    });

    try {
      await newUser.save();
      console.log(`User ${user.name} (${user.email}) seeded successfully!`);
    } catch (error) {
      console.error(`Error seeding user ${user.name}:`, error);
    }
  }

  mongoose.connection.close();
};

seedUsers();
