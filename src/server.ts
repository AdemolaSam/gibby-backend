import express, { Request, Response } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { connectToDB } from "./config/db";
import { globalErrorHandler } from "./middlewares/error-handler";
dotenv.config();
// .......................

const PORT = process.env.PORT || 7000;

const app = express();

app.use(morgan("dev"));
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.send("Great!!. Full fledged");
});

// app.use(globalErrorHandler);

app.listen(PORT, async () => {
  console.log("Server listening on port: ", PORT);
  await connectToDB();
});
