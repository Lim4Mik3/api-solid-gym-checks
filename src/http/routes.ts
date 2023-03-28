import { FastifyInstance } from 'fastify';
import { authenticate } from './controllers/authenticate';
import { profile } from './controllers/profiile';
import { register } from './controllers/register';
import { VerfiyJwt } from './middlewares/verify-jwt';

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', register);
  app.post('/sessions', authenticate);

  /**  Authenticate routes  */
  app.get('/me', { onRequest: [VerfiyJwt] }, profile);
}
