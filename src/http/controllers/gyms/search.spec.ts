import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { app } from '@/app';
import { createAuthenticateUserToTests } from '@/utils/create-authenticate-user-to-tests';
import request from 'supertest';

describe('Fetch Search Gyms (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able fetcg search gyms by query param', async () => {
    const { authToken } = await createAuthenticateUserToTests(app, true);

    const httpAgent = request.agent(app.server);

    await httpAgent
      .post('/gyms')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Wonderful Gym Near',
        description: 'This is near gym',
        latitude: -23.4923636,
        longitude: -46.7768741,
        phone: '11 984511162',
      });

    await httpAgent
      .post('/gyms')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'JavaScript Gym Far',
        description: 'This is my far way gym',
        latitude: -23.7346734,
        longitude: -46.6011279,
        phone: '11 984511162',
      });

    const response = await httpAgent
      .get('/gyms/search')
      .set('Authorization', `Bearer ${authToken}`)
      .query({ q: 'Far' })
      .send();

    expect(response.status).toBe(200);
    expect(response.body.gyms).toHaveLength(1);
    expect(response.body.gyms).toEqual([
      expect.objectContaining({ description: 'This is my far way gym' }),
    ]);
  });
});
