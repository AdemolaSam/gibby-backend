import { CreateTaskDto, QueryTaskDto } from "../dtos/task.dto";
import { TaskModel } from "../models/task.model";

export class TaskService {
  constructor(private readonly taskModel: typeof TaskModel) {}

  public async createTask(taskDto: CreateTaskDto) {
    const task = await this.taskModel.find({
      name: taskDto.name,
      ownerId: taskDto.ownerId,
    });

    if (task) {
      throw new Error("Task Exists");
    }

    const newTask = await this.taskModel.create(taskDto);
    return newTask;
  }

  public async fetchUserTasks(taskDto: QueryTaskDto) {
    // const {} = QueryTaskDto
    // Will implement pagination
    const tasks = await this.taskModel.find({
      ...taskDto,
    });
    return tasks;
  }
}
