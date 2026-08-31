import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';

import { AppModule } from './../src/app.module';

describe('Auth (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule =
      await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
  });

  it('should login successfully', async () => {
    const email = `e2e-${Date.now()}@gmail.com`;
    const password = 'Test12345';

    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email,
        password,
      })
      .expect(201);

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email,
        password,
      })
      .expect(201);

    expect(response.body.access_token).toBeDefined();
  });

  it('should reject wrong password', async () => {
    const email = `wrong-${Date.now()}@gmail.com`;
    const password = 'Test12345';

    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email,
        password,
      })
      .expect(201);

    await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email,
        password: 'WrongPassword123',
      })
      .expect(401);
  });

  afterAll(async () => {
    await app.close();
  });
});