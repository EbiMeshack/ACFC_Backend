import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export function mongoConnection() {
  mongoose
    .connect(process.env.MONGOURI)
    .then(() => {
      console.log("Connected to MongoDB successfully!");
    })
    .catch((error) => {
      console.error("❌ Failed to connect to MongoDB:", error.message);
      process.exit(1);
    });
}
