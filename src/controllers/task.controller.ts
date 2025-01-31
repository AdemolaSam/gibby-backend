import { NextFunction, Request, Response } from "express";

import { TaskService } from "../services/task.service";

import { ITask, TaskModel } from "../models/task.model";
const taskService = new TaskService(TaskModel);

export async function createTask(
  req: any,
  res: Response,
  next: NextFunction
): Promise<ITask | any> {
  try {
    const taskObj = req.body;
    console.log("user: ", req.user);
    taskObj.owner = req.user._id;
    const newTask = await taskService.createTask(req.body);
    return res.status(201).json(newTask);
  } catch (error) {
    next(error);
  }
}

export async function findSingleTask(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<ITask | any> {
  try {
    const task = await taskService.fetchSingleTask(req.params.id);
    return res.status(200).json(task);
  } catch (error) {
    next(error);
  }
}

export async function findAllTask(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<ITask[] | any> {
  try {
    const task = await taskService.fetchUserTasks(req.query);
    return res.status(200).json(task);
  } catch (error) {
    next(error);
  }
}
