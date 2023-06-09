import { CheckInsRepository } from '@/repositories/check-ins-repository';
import { UsersRepository } from '@/repositories/users-repository';
import { ResourceNotFoundError } from './errors/resource-not-found';

interface GetUserCheckInsMetricsUseCaseRequest {
  userId: string;
}

interface GetUserCheckInsMetricsUseCaseResponse {
  metrics: number;
}

export class GetUserCheckInsMetricsUseCase {
  constructor(
    private checkInsRepository: CheckInsRepository,
    private usersRepository: UsersRepository
  ) {}

  async execute({
    userId,
  }: GetUserCheckInsMetricsUseCaseRequest): Promise<GetUserCheckInsMetricsUseCaseResponse> {
    const isUserIdValid = await this.usersRepository.findById(userId);

    if (!isUserIdValid) {
      throw new ResourceNotFoundError();
    }

    const totalCheckInsCount = await this.checkInsRepository.countByUseId(
      userId
    );

    return {
      metrics: totalCheckInsCount,
    };
  }
}
