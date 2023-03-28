import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { app } from '@/app';
import request from 'supertest';

describe('Register (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able register a new user', async () => {
    const response = await request(app.server).post('/users').send({
      name: 'Leonardo Camargo',
      email: 'leo.test@gmail.com',
      password: '123456',
    });

    expect(response.status).toBe(201);
  });

  it('should not be able register a user with the same email', async () => {
    await request(app.server).post('/users').send({
      name: 'Leonardo Camargo',
      email: 'leo.test@gmail.com',
      password: '123456',
    });

    const response = await request(app.server).post('/users').send({
      name: 'Leonardo Copy',
      email: 'leo.test@gmail.com',
      password: '123456',
    });

    expect(response.status).toBe(409);
    expect(response.body).toEqual(
      expect.objectContaining({ message: expect.any(String) })
    );
  });
});
