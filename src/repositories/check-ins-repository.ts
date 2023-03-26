import { Checkin, Prisma } from '@prisma/client';

export interface CheckInsRepository {
  create(data: Prisma.CheckinUncheckedCreateInput): Promise<Checkin>;
  findById(id: string): Promise<Checkin | null>;
  findByUserIdOnDate(userId: string, date: Date): Promise<Checkin | null>;
  findManyByUserId(userId: string, page: number): Promise<Checkin[]>;
  countByUseId(userId: string): Promise<number>;
  save(checkin: Checkin): Promise<Checkin>;
}
