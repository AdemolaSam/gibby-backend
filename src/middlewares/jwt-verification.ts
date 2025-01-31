import { NextFunction, Request, Response } from "express";
import { AuthError } from "./error-handler";
import { AuthService } from "../services/auth.service";
import { IUser, UserModel } from "../models/user.model";
const authService = new AuthService(UserModel);

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export async function authenticateJWT(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const accessToken = req.cookies.gibby_accessToken;
    const refreshToken = req.cookies.gibby_refreshToken;

    if (!accessToken && !refreshToken) {
      return next(new AuthError("....Missing Authentication Token...."));
    }

    const isValidAccessToken = accessToken
      ? authService.verifyToken(accessToken, "access")
      : null; // decodes the token
    const isValidRefreshToken = refreshToken
      ? authService.verifyToken(refreshToken, "refresh")
      : null;

    if (!isValidAccessToken && !isValidRefreshToken) {
      return next(new AuthError("Invalid or Expired Token"));
    }

    if (!isValidAccessToken && isValidRefreshToken) {
      console.log("[MESSAGE]: ", "Token Renewed_______");
      const userPayload: any = isValidRefreshToken;
      const newAccessToken = authService.generateAccessToken(userPayload._doc);

      req.user = userPayload._doc;

      res.cookie("gibby_accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        maxAge: 20 * 1000 * 60, // 20 minutes
      });
    }
    next();
  } catch (error) {
    console.log({ error });
    next(error);
  }
}
