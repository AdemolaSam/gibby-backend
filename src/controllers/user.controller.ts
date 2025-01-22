import { NextFunction, Request, Response } from "express";
import { IUser, UserModel } from "../models/user.model";
import { UserService } from "../services/user.service";

const userService = new UserService(UserModel);

export async function createUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<IUser | any> {
  try {
    const user = await userService.createUser(req.body);

    return res.status(201).json(user);
  } catch (error) {
    next(error);
  }
}

export async function findUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  try {
    const user = await userService.findOne(req.params.id);

    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
}
