import { Status } from '@prisma/client';
import { IsNotEmpty } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  description: string;
  dueDate: string;
  status: Status;
}
