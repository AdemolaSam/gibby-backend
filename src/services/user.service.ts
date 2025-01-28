import { IUser, UserModel } from "../models/user.model";
import * as bcrypt from "bcrypt";

export class UserService {
  constructor(private userModel: typeof UserModel) {}

  public async createUser(userDetails: IUser): Promise<IUser | any> {
    const email = userDetails.email;
    const isExistingUser = await this.userModel.findOne({
      email,
    });
    if (isExistingUser) {
      throw new Error("Email not available");
    }
    let hashedPassWord;
    if (userDetails.password) {
      hashedPassWord = await bcrypt.hash(userDetails.password, 13);
      userDetails.password = hashedPassWord;
    }
    if (userDetails.role) {
      userDetails.role = "regular";
    }
    const user = await this.userModel.create(userDetails);
    return user;
  }

  public async findOne(id: string): Promise<IUser | any> {
    const user = await this.userModel.findById(id);

    return user;
  }

  public async findAllUser() {
    return await this.userModel.find({});
  }
}
