import { Controller } from '@nestjs/common';
import { TaskService } from './task.service';
import { GrpcMethod } from '@nestjs/microservices';
import { CreateTaskRequest } from 'src/stubs/task/v1alpha/task';

@Controller()
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @GrpcMethod('TaskService')
  createTask(data: CreateTaskRequest) {
    const newTask = data.task;

    return this.taskService.create(newTask as any);
  }
}
