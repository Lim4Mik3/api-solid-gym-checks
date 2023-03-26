import { CheckInsRepository } from '@/repositories/check-ins-repository';
import { Checkin } from '@prisma/client';
import { ResourceNotFoundError } from './errors/resource-not-found';

interface ValidateCheckInUseCaseRequest {
  checkinId: string;
}

interface ValidateCheckInUseCaseResponse {
  checkin: Checkin;
}

export class ValidateCheckInUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    checkinId,
  }: ValidateCheckInUseCaseRequest): Promise<ValidateCheckInUseCaseResponse> {
    const check_in = await this.checkInsRepository.findById(checkinId);

    if (!check_in) {
      throw new ResourceNotFoundError();
    }

    check_in.validated_at = new Date();

    await this.checkInsRepository.save(check_in);

    return {
      checkin: check_in,
    };
  }
}
