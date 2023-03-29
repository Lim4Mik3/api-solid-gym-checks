import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';

import { app } from '@/app';

describe('Refresh Token Controller (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able receive a new token once my access token expires', async () => {
    const httpAgent = request.agent(app.server);

    await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const authResponse = await httpAgent.post('/sessions').send({
      email: 'johndoe@example.com',
      password: '123456',
    });

    const cookies = authResponse.get('Set-Cookie');

    const response = await httpAgent
      .patch('/token/refresh')
      .set('Cookie', cookies)
      .send();

    console.log('body', response.body);

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      token: expect.any(String),
    });
    expect(response.get('Set-Cookie')).toEqual([
      expect.stringContaining('refreshToken='),
    ]);
  });
});
