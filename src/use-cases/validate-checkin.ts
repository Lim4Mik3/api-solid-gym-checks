import { CheckInsRepository } from '@/repositories/check-ins-repository';
import { Checkin } from '@prisma/client';
import dayjs from 'dayjs';
import { LateCheckInValidationError } from './errors/late-check-in-validation-error';
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

    const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
      check_in.created_at,
      'minutes'
    );

    if (distanceInMinutesFromCheckInCreation > 20) {
      throw new LateCheckInValidationError();
    }

    check_in.validated_at = new Date();

    await this.checkInsRepository.save(check_in);

    return {
      checkin: check_in,
    };
  }
}
