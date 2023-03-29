import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { app } from '@/app';
import { createAuthenticateUserToTests } from '@/utils/create-authenticate-user-to-tests';
import { prisma } from '@/lib/prisma';
import request from 'supertest';

describe('Validate Check-In Controller (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to validate a check-in', async () => {
    const { authToken } = await createAuthenticateUserToTests(app, true);

    const httpAgent = request.agent(app.server);

    const createdGym = await prisma.gym.create({
      data: {
        title: 'Wonderful Gym',
        description: 'This is my best gym ever',
        latitude: -23.4923636,
        longitude: -46.7768741,
        phone: '11 984511162',
      },
    });

    // Create first checkin
    await httpAgent
      .post(`/gyms/${createdGym.id}/check-ins`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        latitude: -23.4923636,
        longitude: -46.7768741,
      });

    const createdCheckIn = await prisma.checkin.findFirstOrThrow();

    const response = await httpAgent
      .patch(`/check-ins/${createdCheckIn.id}/validate`)
      .set('Authorization', `Bearer ${authToken}`)
      .send();

    const updatedCheckIn = await prisma.checkin.findFirstOrThrow();

    expect(response.status).toBe(200);
    expect(updatedCheckIn.validated_at).toEqual(expect.any(Date));
    expect(updatedCheckIn).toEqual(
      expect.objectContaining({
        id: updatedCheckIn.id,
        validated_at: updatedCheckIn.validated_at,
      })
    );
  });
});
