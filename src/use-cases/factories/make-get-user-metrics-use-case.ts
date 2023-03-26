import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository';
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { GetUserCheckInsMetricsUseCase } from '../get-user-checkin-metrics';

export function makeGetUserMetricsUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository();
  const usersRepositoru = new PrismaUsersRepository();

  const useCase = new GetUserCheckInsMetricsUseCase(
    checkInsRepository,
    usersRepositoru
  );

  return useCase;
}
