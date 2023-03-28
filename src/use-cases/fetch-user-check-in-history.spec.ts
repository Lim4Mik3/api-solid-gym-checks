import { CheckInsRepository } from '@/repositories/check-ins-repository';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { FetchUserCheckInHistoryUseCase } from './fetch-user-check-in-history';

let checkInsRepository: CheckInsRepository;
let sut: FetchUserCheckInHistoryUseCase;

describe('Fetch User Check Ins History Use Case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new FetchUserCheckInHistoryUseCase(checkInsRepository);
  });

  it('should be able to fetch user checkins history', async () => {
    await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    });

    await checkInsRepository.create({
      gym_id: 'gym-02',
      user_id: 'user-01',
    });

    const { history } = await sut.execute({
      userId: 'user-01',
      page: 1,
    });

    expect(history).toHaveLength(2);
    expect(history).toEqual([
      expect.objectContaining({ gym_id: 'gym-01' }),
      expect.objectContaining({ gym_id: 'gym-02' }),
    ]);
  });

  it('should be able to fetch user checkins history paginated', async () => {
    for (let i = 1; i <= 22; i++) {
      await checkInsRepository.create({
        gym_id: `gym-${i}`,
        user_id: 'user-01',
      });
    }

    const { history } = await sut.execute({
      userId: 'user-01',
      page: 2,
    });

    expect(history).toHaveLength(2);
    expect(history).toEqual([
      expect.objectContaining({ gym_id: 'gym-21' }),
      expect.objectContaining({ gym_id: 'gym-22' }),
    ]);
  });
});
