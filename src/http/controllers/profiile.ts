import { FastifyRequest, FastifyReply } from 'fastify';

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user.sub;

  console.log('User ID', userId);

  return reply.status(200).send();
}
