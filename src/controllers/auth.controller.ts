import { Request, Response } from "express";
import { AuthService, ILoginCredential } from "../services/auth.service";

export class AuthController {
  constructor(private authService: AuthService) {}

  public async loginUser(req: Request, res: Response) {
    const { accessToken, refreshToken } = await this.authService.loginUser(
      req.body
    );
    res.cookie("gibby_accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      maxAge: 20 * 1000 * 60, // 20 minutes
    });

    res.cookie("gibby_refreshToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      maxAge: 10 * 1000 * 60 * 60 * 24, // 10 days
    });
  }
}
