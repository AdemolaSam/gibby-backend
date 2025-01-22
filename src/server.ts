import express, { Request, Response } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { connectToDB } from "./config/db";
import { globalErrorHandler } from "./middlewares/error-handler";
import userRouter from "./routes/user.route";
import authRouter from "./routes/auth.route";
dotenv.config();
// .......................

const PORT = process.env.PORT || 7000;

const startServer = async () => {
  try {
    await connectToDB();

    const app = express();

    app.use(express.json());
    app.use(express.urlencoded());
    app.use(morgan("dev"));
    app.use(cookieParser());

    app.use("/api/auth", authRouter);
    app.use("/api/user", userRouter);

    app.use(globalErrorHandler);

    app.listen(PORT, async () => {
      console.log("Server listening on port: ", PORT);
    });
  } catch (error: any) {
    console.log("Failed to start server: ", error.message);
    process.exit(1);
  }
};

startServer();
