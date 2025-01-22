import { NextFunction, Request, Response } from "express";
import { AuthService, ILoginCredential } from "../services/auth.service";
import { UserModel } from "../models/user.model";

interface ILogoutMessage {
  message: string;
}

const authService = new AuthService(UserModel);

export async function loginUser(req: Request, res: Response): Promise<any> {
  const { accessToken, refreshToken } = await authService.loginUser(req.body);
  res.cookie("gibby_accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    maxAge: 20 * 1000 * 60, // 20 minutes
  });

  res.cookie("gibby_refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    maxAge: 10 * 1000 * 60 * 60 * 24, // 10 days
  });

  return res.status(200).json({ message: "Login Successful" });
}

export function logoutUser(
  req: Request,
  res: Response,
  next: NextFunction
): ILogoutMessage | any {
  res.clearCookie("gibby_accessToken");
  res.clearCookie("gibby_refreshToken");
  return res
    .status(200)
    .json({ message: "You are out! We hope to see you soon" });
}
