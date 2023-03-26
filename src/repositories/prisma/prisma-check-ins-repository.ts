import { prisma } from '@/lib/prisma';
import { Prisma, Checkin } from '@prisma/client';
import dayjs from 'dayjs';
import { CheckInsRepository } from '../check-ins-repository';

export class PrismaCheckInsRepository implements CheckInsRepository {
  async create(data: Prisma.CheckinUncheckedCreateInput) {
    const checkin = await prisma.checkin.create({
      data,
    });

    return checkin;
  }

  async findById(id: string) {
    const checkin = await prisma.checkin.findUnique({
      where: {
        id,
      },
    });

    return checkin;
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf('date');
    const endOfTheDay = dayjs(date).endOf('date');

    const checkins = await prisma.checkin.findFirst({
      where: {
        user_id: userId,
        created_at: {
          gte: startOfTheDay.toDate(),
          lte: endOfTheDay.toDate(),
        },
      },
    });

    return checkins;
  }

  async findManyByUserId(userId: string, page: number) {
    const checkins = await prisma.checkin.findMany({
      where: {
        user_id: userId,
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return checkins;
  }

  async countByUseId(userId: string) {
    const checkins_count = await prisma.checkin.count({
      where: {
        user_id: userId,
      },
    });

    return checkins_count;
  }

  async save(data: Checkin) {
    const checkin = await prisma.checkin.update({
      where: {
        id: data.id,
      },
      data,
    });

    return checkin;
  }
}
