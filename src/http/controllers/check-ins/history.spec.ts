import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { app } from '@/app';
import { createAuthenticateUserToTests } from '@/utils/create-authenticate-user-to-tests';
import { prisma } from '@/lib/prisma';
import request from 'supertest';

describe('Get History Controller (e2e)', () => {
  beforeAll(async () => {
    vi.useFakeTimers();

    await app.ready();
  });

  afterAll(async () => {
    vi.useRealTimers();

    await app.close();
  });

  it('should be able get user check-ins history', async () => {
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

    const httpAgent = request.agent(app.server);

    vi.setSystemTime(new Date(2023, 0, 10, 14, 0));

    // Create first checkin
    await httpAgent
      .post(`/gyms/${createdGym.id}/check-ins`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        latitude: -23.4923636,
        longitude: -46.7768741,
      });

    const _24_HOURS_IN_MS = 1000 * 60 * 60 * 24;

    vi.advanceTimersByTime(_24_HOURS_IN_MS);

    // Create second checkin
    await httpAgent
      .post(`/gyms/${createdGym.id}/check-ins`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        latitude: -23.4923636,
        longitude: -46.7768741,
      });

    const response = await httpAgent
      .get('/check-ins/history')
      .set('Authorization', `Bearer ${authToken}`)
      .send();

    expect(response.status).toBe(200);

    expect(response.body.history).toHaveLength(2);
    expect(response.body.history).toEqual([
      expect.objectContaining({ gym_id: createdGym.id }),
      expect.objectContaining({ gym_id: createdGym.id }),
    ]);
  });
});
