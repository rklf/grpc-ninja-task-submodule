import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { CreateTaskDto } from './../src/task/dto/create-task.dto';
import { PrismaClient } from '@prisma/client';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  const prisma = new PrismaClient();

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeAll(async () => {
    const deleteTasks = prisma.task.deleteMany();

    await prisma.$transaction([deleteTasks]);

    await prisma.$disconnect();
  });

  afterEach(async () => {
    const deleteTasks = prisma.task.deleteMany();

    await prisma.$transaction([deleteTasks]);

    await prisma.$disconnect();
  });

  it('/task (POST)', () => {
    const dueDate = new Date();
    return request(app.getHttpServer())
      .post('/task')
      .send({
        title: '01',
        dueDate,
      } as CreateTaskDto)
      .expect(201)
      .expect(function (res) {
        expect(res.body).toEqual(
          expect.objectContaining({
            title: '01',
            dueDate: dueDate.toISOString(),
          }),
        );
      });
  });

  it('/task (GET)', () => {
    return request(app.getHttpServer()).get('/task').expect(200).expect([]);
  });

  it('/task/:id (GET)', async () => {
    let id: number;
    await request(app.getHttpServer())
      .post('/task')
      .send({
        title: '01',
      } as CreateTaskDto)
      .expect(201)
      .then(({ body }) => (id = body.id));

    return request(app.getHttpServer())
      .get('/task/' + id)
      .expect(200)
      .expect(function (res) {
        expect(res.body).toEqual(
          expect.objectContaining({
            title: '01',
            id,
          }),
        );
      });
  });
});
