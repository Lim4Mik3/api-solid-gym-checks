import { makeValidateCheckInUseCase } from '@/use-cases/factories/make-validate-check-in-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function validate(request: FastifyRequest, reply: FastifyReply) {
  const validateCheckInParamsSchema = z.object({
    checkinId: z.string().uuid(),
  });

  const { checkinId } = validateCheckInParamsSchema.parse(request.params);

  const validateCheckinUseCase = makeValidateCheckInUseCase();

  await validateCheckinUseCase.execute({
    checkinId,
  });

  return reply.status(200).send();
}
