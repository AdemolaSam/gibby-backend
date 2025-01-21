import { IUser, UserModel } from "../models/user.model";
import * as bcrypt from "bcrypt";

export class UserService {
  constructor(private userModel: typeof UserModel) {}

  public async createUser(userDetails: IUser) {
    let hashedPassWord;
    if (userDetails.password) {
      hashedPassWord = await bcrypt.hash(userDetails.password, 13);
      userDetails.password = hashedPassWord;
    }
    return await this.userModel.create(userDetails);
  }

  public async findOne(id: string) {
    return await this.userModel.findById(id);
  }

  public async findAllUser() {
    return await this.userModel.find({});
  }
}
