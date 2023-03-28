import { FastifyInstance } from 'fastify';
import request from 'supertest';

export async function createAuthenticateUserToTests(app: FastifyInstance) {
  await request(app.server).post('/users').send({
    name: 'Leonardo Oliveira',
    email: 'leo.test@gmail.com',
    password: '123456789',
  });

  const authResponse = await request(app.server).post('/sessions').send({
    email: 'leo.test@gmail.com',
    password: '123456789',
  });

  return {
    authToken: authResponse.body.token,
  };
}
