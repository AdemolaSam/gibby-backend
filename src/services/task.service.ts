import { CreateTaskDto, QueryTaskDto } from "../dtos/task.dto";
import { APIError } from "../middlewares/error-handler";
import { ITask, TaskModel } from "../models/task.model";

export class TaskService {
  constructor(private readonly taskModel: typeof TaskModel) {}

  public async createTask(taskDto: CreateTaskDto): Promise<ITask | any> {
    console.log(taskDto);
    const task = await this.taskModel.findOne({
      name: taskDto.name,
      owner: taskDto.owner,
    });

    if (task) {
      throw new APIError("Task Already Exists", 400);
    }

    const newTask = await this.taskModel.create(taskDto);
    return newTask;
  }

  /**
   * Returns all tasks based on the query parameters
   * @param taskDto
   * @returns {tasks, nestCursor: string}
   */
  public async fetchUserTasks(taskDto: QueryTaskDto) {
    let { limit, cursor, ...others } = taskDto;
    if (!limit) {
      limit = 20;
    }

    const query: any = { others };
    if (cursor) {
      query._id = { $lt: cursor };
    }

    const tasks = await this.taskModel
      .find(query)
      .sort({ _id: -1 })
      .limit(limit + 1);

    const hasNextPage = tasks.length > limit;
    const nextCursor = hasNextPage ? tasks[limit]._id : null;
    return {
      tasks,
      nextCursor,
    };
  }

  public async fetchSingleTask(id: string) {
    const task = await this.taskModel.findById(id);
    return task;
  }
}
