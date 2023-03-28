import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { app } from '@/app';
import request from 'supertest';

describe('Authenticate (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able authenticate a new user', async () => {
    await request(app.server).post('/users').send({
      name: 'Leonardo Camargo',
      email: 'leo.test@gmail.com',
      password: '123456',
    });

    const response = await request(app.server).post('/sessions').send({
      email: 'leo.test@gmail.com',
      password: '123456',
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      token: expect.any(String),
    });
  });

  it('should not be able authenticate a wrong credentials user', async () => {
    await request(app.server).post('/users').send({
      name: 'Leonardo Camargo',
      email: 'leo.test@gmail.com',
      password: '123456',
    });

    const response = await request(app.server).post('/sessions').send({
      email: 'leo.test@gmail.com',
      password: '654321',
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: expect.any(String),
    });
  });
});
