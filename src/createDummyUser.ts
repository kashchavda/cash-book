import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();

import { User } from "./models/user.model";

const createDummyUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL as string);
    console.log("MongoDB Connected");

    const email = "kashchavda1209@gmail.com";
    const password = "12345678";

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.log("User already exists. Deleting old user...");
      await User.deleteOne({ email });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      email,
      password: hashedPassword
    });

    console.log("Dummy user created successfully!");
    console.log("Email:", email);
    console.log("Password:", password);

    process.exit();
  } catch (error) {
    console.log("Error:", error);
    process.exit(1);
  }
};

createDummyUser();
