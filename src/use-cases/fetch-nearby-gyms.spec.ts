import { GymsRepository } from '@/repositories/gyms-repository';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms';

let gymsRepository: GymsRepository;
let sut: FetchNearbyGymsUseCase;

describe('Fetch Nearby Gyms Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new FetchNearbyGymsUseCase(gymsRepository);
  });

  it('should be able fetch near gyms correctly', async () => {
    await gymsRepository.create({
      title: 'Near Gym',
      latitude: -23.503777,
      longitude: -46.7742563,
    });

    await gymsRepository.create({
      title: 'Far Gym',
      latitude: -23.4840277,
      longitude: -46.5650627,
    });

    const { gyms } = await sut.execute({
      userLatitude: -23.4923636,
      userLongitude: -46.7768741,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })]);
  });
});
