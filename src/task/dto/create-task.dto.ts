import { Status } from '@prisma/client';

export class CreateTaskDto {
  title: string;
  description: string;
  dueDate: Date | string;
  status: Status;
}
