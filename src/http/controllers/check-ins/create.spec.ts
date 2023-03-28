import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { app } from '@/app';
import { createAuthenticateUserToTests } from '@/utils/create-authenticate-user-to-tests';
import { prisma } from '@/lib/prisma';
import request from 'supertest';

describe('Create Check-in Controller (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able create a checkin correctly', async () => {
    const { authToken } = await createAuthenticateUserToTests(app);

    const createdGym = await prisma.gym.create({
      data: {
        title: 'Wonderful Gym',
        description: 'This is my best gym ever',
        latitude: -23.4923636,
        longitude: -46.7768741,
        phone: '11 984511162',
      },
    });

    const response = await request(app.server)
      .post(`/gyms/${createdGym.id}/check-ins`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        latitude: -23.4923636,
        longitude: -46.7768741,
      });

    expect(response.status).toBe(200);
  });
});
