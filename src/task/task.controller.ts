import { Controller } from '@nestjs/common';
import { TaskService } from './task.service';
import { GrpcMethod } from '@nestjs/microservices';
import taskStub from '@buf/bneiconseil_iw4-ninja.grpc_node/task/v1alpha/task_pb';

@Controller()
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @GrpcMethod('TaskService')
  createTask(data: taskStub.CreateTaskRequest) {
    const newTask = data.Task;

    return this.taskService.create(newTask);
  }
}
