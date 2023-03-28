import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { app } from '@/app';
import request from 'supertest';

describe('Get User Profile (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able get logged user profile', async () => {
    await request(app.server).post('/users').send({
      name: 'Leonardo Camargo',
      email: 'leo.test@gmail.com',
      password: '123456',
    });

    const authResponse = await request(app.server).post('/sessions').send({
      email: 'leo.test@gmail.com',
      password: '123456',
    });

    const { token } = authResponse.body;

    const profileResponse = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(profileResponse.status).toBe(200);
    expect(profileResponse.body.user).toEqual(
      expect.objectContaining({
        email: 'leo.test@gmail.com',
      })
    );
  });
});
