import { NextFunction, Request, Response } from "express";
import { AuthError } from "./error-handler";
import { AuthService } from "../services/auth.service";
import { IUser } from "../models/user.model";

export class MiddleWare {
  constructor(private authService: AuthService) {}
  public async authenticateJWT(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const accessToken = req.cookies.gibby_accessToken;
    const refreshToken = req.cookies.gibby_refreshToken;

    if (!accessToken) {
      throw new AuthError("....Missing Authentication Token....");
    }

    const isValidAccessToken = await this.authService.verifyToken(
      accessToken,
      "access"
    ); // decodes the token
    const isValidRefreshToken = await this.authService.verifyToken(
      refreshToken,
      "refresh"
    );
    if (!isValidAccessToken && !isValidRefreshToken) {
      throw new AuthError("Invalid or Expired Token");
    }

    if (!isValidAccessToken && isValidRefreshToken) {
      const user: any = isValidRefreshToken;
      const newAccessToken = this.authService.generateAccessToken(user);
      res.cookie("gibby_accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        maxAge: 20 * 1000 * 60, // 20 minutes
      });
    }
  }
}
