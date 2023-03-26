import { CheckInsRepository } from '@/repositories/check-ins-repository';

interface FetchUserCheckInHistoryUseCaseRequest {
  userId: string;
  page: number;
}

export class FetchUserCheckInHistoryUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({ userId, page }: FetchUserCheckInHistoryUseCaseRequest) {
    const checkIns = await this.checkInsRepository.findManyByUserId(
      userId,
      page
    );

    return {
      checkIns,
    };
  }
}
