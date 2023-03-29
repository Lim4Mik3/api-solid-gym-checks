import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { app } from '@/app';
import { createAuthenticateUserToTests } from '@/utils/create-authenticate-user-to-tests';
import request from 'supertest';

describe('Create Gym Controller (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able create a gym correctly', async () => {
    const { authToken } = await createAuthenticateUserToTests(app, true);

    const httpAgent = request.agent(app.server);

    const response = await httpAgent
      .post('/gyms')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Wonderful Gym',
        description: 'This is my best gym ever',
        latitude: -23.4923636,
        longitude: -46.7768741,
        phone: '11 984511162',
      });

    expect(response.status).toBe(201);
  });
});
