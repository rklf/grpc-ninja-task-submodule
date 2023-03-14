import { Controller, UseFilters } from '@nestjs/common';
import { TaskService } from './task.service';
import { GrpcMethod } from '@nestjs/microservices';
import {
  CreateTaskRequest,
  GetTaskRequest,
  ListTasksRequest,
  Status,
  ListTasksResponse,
  Task,
  UpdateTaskRequest,
} from 'src/stubs/task/v1alpha/task';
import { Status as prismaStatus } from '@prisma/client';
import { NotUniqueException } from 'src/exceptions/notunique-exception.filter';

@Controller()
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @GrpcMethod('TaskService')
  @UseFilters(NotUniqueException)
  createTask(data: CreateTaskRequest) {
    const newTask = data.task;

    return this.taskService.create(newTask as any);
  }

  @GrpcMethod('TaskService')
  async ListTasks(request: ListTasksRequest): Promise<ListTasksResponse> {
    const tasks = await this.taskService.findAll();

    const res = ListTasksResponse.create({
      tasks: tasks.map((t) =>
        Task.create({
          id: t.id,
          title: t.title,
          description: t.description,
          dueDate: t.dueDate,
          status: Status[t.status],
        }),
      ),
    });

    return res;
  }

  @GrpcMethod('TaskService')
  @UseFilters(NotUniqueException)
  async GetTask(request: GetTaskRequest): Promise<Task> {
    const task = await this.taskService.findById(request.id);
    return {...task, status: Status[task.status]};
  }

  @GrpcMethod('TaskService')
  async DeleteTask(request: GetTaskRequest): Promise<Task> {
    const task = await this.taskService.remove(request.id);
    return {...task, status: Status[task.status]};
  }

  @GrpcMethod('TaskService')
  async UpdateTask(request: UpdateTaskRequest): Promise<Task> {
    const task = {...request.task, status: prismaStatus[request.task.status]};
    const updatedTask = await this.taskService.update(task.id, task);
    return {...updatedTask, status: Status[updatedTask.status]};
  }
}
