import * as jwt from "jsonwebtoken";
import { IUser, UserModel } from "../models/user.model";
import { AuthError } from "../middlewares/error-handler";
import * as bcrypt from "bcrypt";
const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET as string;
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET as string;

export interface ILoginCredential {
  email: string;
  password: string;
}

export class AuthService {
  constructor(private userModel: typeof UserModel) {}
  public async generateAccessToken(user: IUser): Promise<string> {
    return await jwt.sign(user, ACCESS_TOKEN_SECRET, { expiresIn: "20m" });
  }

  public async generateRefreshToken(user: IUser): Promise<string> {
    return await jwt.sign(user, REFRESH_TOKEN_SECRET, { expiresIn: "10d" });
  }

  public async verifyToken(token: string, type: "access" | "refresh") {
    const secret: any =
      type === "access" ? ACCESS_TOKEN_SECRET : REFRESH_TOKEN_SECRET;
    try {
      const decodedUser = await jwt.decode(token, secret);
      return decodedUser;
    } catch (error) {
      console.log("Failed to verify user", error);
      return null;
    }
  }

  public async loginUser(
    userCredentials: ILoginCredential
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.userModel.findOne<IUser>({
      email: userCredentials.email,
    });
    if (!user) {
      throw new AuthError("User Not found");
    }

    const isValidPassword = await bcrypt.compare(
      userCredentials.password,
      user.password
    );
    if (!isValidPassword) {
      throw new AuthError("Invalid Credentials");
    }

    const accessToken = await this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user);

    return {
      accessToken,
      refreshToken,
    };
  }
}
