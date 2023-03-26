import { CheckInsRepository } from '@/repositories/check-ins-repository';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ResourceNotFoundError } from './errors/resource-not-found';
import { ValidateCheckInUseCase } from './validate-checkin';

let checkInsRepository: CheckInsRepository;
let sut: ValidateCheckInUseCase;

describe('Validate Check In Use Case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new ValidateCheckInUseCase(checkInsRepository);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be able validate a checkin', async () => {
    const createdCheckIn = await checkInsRepository.create({
      gym_id: 'any-gym-id',
      user_id: 'any-user-id',
    });

    const { checkin } = await sut.execute({
      checkinId: createdCheckIn.id,
    });

    expect(checkin.validated_at).toEqual(expect.any(Date));
    expect(checkInsRepository.items[0].validated_at).toEqual(expect.any(Date));
  });

  it('should not be able validate a non existent chekin', async () => {
    await expect(() =>
      sut.execute({
        checkinId: 'an-inexistent-id',
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to valite a checkin after 20 minutes of its creation', async () => {
    vi.setSystemTime(new Date(2023, 0, 10, 13, 40));

    const createdCheckIn = await checkInsRepository.create({
      gym_id: 'any-gym-id',
      user_id: 'any-user-id',
    });

    const _21_MINUTES_IN_MS = 1000 * 60 * 21; // 21 Minutes

    vi.advanceTimersByTime(_21_MINUTES_IN_MS);

    await expect(() =>
      sut.execute({
        checkinId: createdCheckIn.id,
      })
    ).rejects.toBeInstanceOf(Error);
  });
});
