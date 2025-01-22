import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const DB_URI = process.env.DB_URI || "";

export const connectToDB = async () => {
  try {
    await mongoose.connect(`${DB_URI}`);
    console.log("Connected to Database");
  } catch (error: any) {
    console.log("An error occured while connecting to the database: ");
  }
};
