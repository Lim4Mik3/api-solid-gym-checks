import { makeFetchNearbyGymsUseCase } from '@/use-cases/factories/make-fetch-nearby-gyms-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function nearby(request: FastifyRequest, reply: FastifyReply) {
  const nearbyQuerySchema = z.object({
    lat: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 90;
    }),
    lon: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 180;
    }),
  });

  const { lat, lon } = nearbyQuerySchema.parse(request.query);

  const fetchNearbyGymsUseCase = makeFetchNearbyGymsUseCase();

  const { gyms } = await fetchNearbyGymsUseCase.execute({
    userLatitude: lat,
    userLongitude: lon,
  });

  return reply.status(200).send({ gyms });
}
