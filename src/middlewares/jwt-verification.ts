import { NextFunction, Request, Response } from "express";
import { AuthError } from "./error-handler";
import { AuthService } from "../services/auth.service";
import { IUser, UserModel } from "../models/user.model";
const authService = new AuthService(UserModel);

// export class MiddleWare {
//   constructor(private authService: AuthService) {}
//   public async authenticateJWT(
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) {
//     try {
//       const accessToken = req.cookies.gibby_accessToken;
//       const refreshToken = req.cookies.gibby_refreshToken;

//       if (!accessToken) {
//         return next(new AuthError("....Missing Authentication Token...."));
//       }

//       const isValidAccessToken = accessToken
//         ? this.authService.verifyToken(accessToken, "access")
//         : null; // decodes the token
//       const isValidRefreshToken = refreshToken
//         ? this.authService.verifyToken(refreshToken, "refresh")
//         : null;

//       if (!isValidAccessToken && !isValidRefreshToken) {
//         return next(new AuthError("Invalid or Expired Token"));
//       }

//       if (!isValidAccessToken && isValidRefreshToken) {
//         const user: any = isValidRefreshToken;
//         const newAccessToken = this.authService.generateAccessToken(user);
//         res.cookie("gibby_accessToken", newAccessToken, {
//           httpOnly: true,
//           secure: process.env.NODE_ENV === "production",
//           sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
//           maxAge: 20 * 1000 * 60, // 20 minutes
//         });
//       }
//       next();
//     } catch (error) {
//       console.log({ error });
//       next(error);
//     }
//   }
// }

export async function authenticateJWT(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const accessToken = req.cookies.gibby_accessToken;
    const refreshToken = req.cookies.gibby_refreshToken;

    if (!accessToken) {
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
      const user: any = isValidRefreshToken;
      const newAccessToken = authService.generateAccessToken(user);
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
