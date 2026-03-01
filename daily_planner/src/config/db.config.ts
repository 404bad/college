import mongoose from "mongoose";

import config from "./env.config";

export const connectDB = async () => {
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log("connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit the process with an error code
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Error disconnecting from MongoDB:", error);
  }
};
