import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UseFilters,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { PrismaService } from '../prisma/prisma.service';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  create(createTaskDto: CreateTaskDto) {
    return this.prisma.task.create({
      data: createTaskDto,
    }).catch((error) => {
      if (error?.code === 'P2002') {
        throw new RpcException({
          code: 400,
          message: `Task already exists (not unique)`,
        });
      }
      throw new Error(error.message);
    });
  }

  findAll() {
    return this.prisma.task.findMany();
  }

  async findById(id: number) {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });
    if (!task) {
      throw new RpcException({
        code: 404,
        message: `Task with id ${id} not found`,
      })
    }
    return task;
  }

  async update(id: number, data: CreateTaskDto) {
    const task = await this.findById(id);

    try {
      return this.prisma.task.update({
        where: { id },
        data,
      });
    } catch (error) {
      if (error?.code === 'P2025') {
        throw new RpcException({
          code: 400,
          message: `Task with id ${id} not found`,
        });
      }
      throw new Error(error.message);
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.task.delete({
        where: { id },
      });
    } catch (error) {
      if (error?.code === 'P2025') {
        throw new NotFoundException(`Task with id ${id} not found`);
      }
      throw new BadRequestException(error.message);
    }
  }
}
