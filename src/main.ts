import { NestFactory } from '@nestjs/core';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { join } from 'path';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ServerCredentials } from '@grpc/grpc-js';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        url: `0.0.0.0:${process.env.PORT || 5000}`,
        package: 'task.v1alpha',
        protoPath: join(
          __dirname,
          process.env.PROTO_PATH || './proto/task/v1alpha/task.proto',
        ),
        loader: {
          enums: String,
        },
        credentials: ServerCredentials.createInsecure(),
      },
    },
  );
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.useGlobalPipes(new ValidationPipe());
  await app.listen();
}
bootstrap();
