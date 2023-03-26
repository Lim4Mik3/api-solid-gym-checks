import { GymsRepository } from '@/repositories/gyms-repository';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { describe, expect, it, beforeEach } from 'vitest';
import { SearchGymsUseCase } from './search-gyms';

let gymsRepository: GymsRepository;
let sut: SearchGymsUseCase;

describe('Seach Gyms Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new SearchGymsUseCase(gymsRepository);
  });

  it('should be able search for a gym', async () => {
    await gymsRepository.create({
      title: 'Leonardo Gyms',
      description: 'This is my best gym ever',
      latitude: 0,
      longitude: 0,
      phone: '11 900000000',
    });

    const { gyms } = await sut.execute({
      query: 'Leonardo',
      page: 1,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ title: 'Leonardo Gyms' })]);
  });

  it('should be able search for gyms paginated', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `Leonardo Gyms ${i}`,
        description: 'This is my best gym ever',
        latitude: 0,
        longitude: 0,
        phone: '11 900000000',
      });
    }

    const { gyms } = await sut.execute({
      query: 'Leonardo',
      page: 2,
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ title: `Leonardo Gyms 21` }),
      expect.objectContaining({ title: `Leonardo Gyms 22` }),
    ]);
  });
});
