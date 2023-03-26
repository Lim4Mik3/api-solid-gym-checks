import { Prisma, Checkin } from '@prisma/client';
import dayjs from 'dayjs';
import { randomUUID } from 'node:crypto';
import { CheckInsRepository } from '../check-ins-repository';

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public items: Checkin[] = [];

  async create(data: Prisma.CheckinUncheckedCreateInput) {
    const checkIn = {
      id: randomUUID(),
      created_at: new Date(),
      gym_id: data.gym_id,
      user_id: data.user_id,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
    };

    this.items.push(checkIn);

    return checkIn;
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf('date');
    const endOfTheDay = dayjs(date).endOf('date');

    const checkIn = this.items.find((checkIn) => {
      const checkInDate = dayjs(checkIn.created_at);
      const isOnSameDate =
        checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay);

      return checkIn.user_id === userId && isOnSameDate;
    });

    if (!checkIn) {
      return null;
    }

    return checkIn;
  }

  async save(checkin: Checkin) {
    const checkInIndex = this.items.findIndex((item) => item.id === checkin.id);

    if (checkInIndex >= 0) {
      this.items[checkInIndex] = checkin;
    }

    return checkin;
  }

  async findById(id: string) {
    const checkin = this.items.find((checkin) => checkin.id === id);

    if (!checkin) {
      return null;
    }

    return checkin;
  }

  async findManyByUserId(userId: string, page: number) {
    const checkIns = this.items
      .filter((checkin) => checkin.user_id === userId)
      .slice((page - 1) * 20, page * 20);

    return checkIns;
  }

  async countByUseId(userId: string) {
    const count = this.items.filter(
      (checkin) => checkin.user_id === userId
    ).length;

    return count;
  }
}
