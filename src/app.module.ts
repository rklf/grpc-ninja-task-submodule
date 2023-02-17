import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import ecsFormat from '@elastic/ecs-winston-format';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { TaskModule } from './task/task.module';

@Module({
  imports: [
    TaskModule,
    WinstonModule.forRoot({
      format: winston.format.json(),
      defaultMeta: {
        'label.api-name': 'task',
      },
      transports: [
        new winston.transports.Console({
          format: winston.format.simple(),
        }),
        new winston.transports.File({
          filename: process.env.LOG_FILE || 'task.log',
          format: ecsFormat(),
          level: 'error',
        }),
      ],
    }),
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
