import { getDistanceBetweenCoordinates } from '@/use-cases/utils/get-distance-between-coordinates';
import { Gym, Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';
import { FindManyNearbyParams, GymsRepository } from '../gyms-repository';

export class InMemoryGymsRepository implements GymsRepository {
  public items: Gym[] = [];

  async findById(gymId: string) {
    const gym = this.items.find((gym) => gym.id === gymId);

    if (!gym) {
      return null;
    }

    return gym;
  }

  async create(data: Prisma.GymCreateInput) {
    const gym: Gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
      created_at: new Date(),
    };

    this.items.push(gym);

    return gym;
  }

  async searchMany(query: string, page: number) {
    return this.items
      .filter((gym) => gym.title.includes(query))
      .slice((page - 1) * 20, page * 20);
  }

  async findManyNearby(params: FindManyNearbyParams) {
    return this.items.filter((gym) => {
      const distance = getDistanceBetweenCoordinates(
        { latitude: params.latitude, longitude: params.longitude },
        {
          latitude: gym.latitude.toNumber(),
          longitude: gym.longitude.toNumber(),
        }
      );

      return distance < 10;
    });
  }
}
