import mongoose from "mongoose";

// stablish a connection to MongoDB
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`MongoDB connected :${conn.connection.host}`);
  } catch (error) {
    console.error(`Error in connecting in MongoDB: ${error.message}`);
    process.exit(1); // Exit the process with failure
  }
};
