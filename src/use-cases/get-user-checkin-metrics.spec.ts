import { CheckInsRepository } from '@/repositories/check-ins-repository';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { UsersRepository } from '@/repositories/users-repository';
import { hash } from 'bcryptjs';
import { describe, expect, it, beforeEach } from 'vitest';
import { ResourceNotFoundError } from './errors/resource-not-found';
import { GetUserCheckInsMetricsUseCase } from './get-user-checkin-metrics';

let checkInsRepository: CheckInsRepository;
let usersRepository: UsersRepository;
let sut: GetUserCheckInsMetricsUseCase;

describe('Get User Checkins Metrics Use Case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository();
    usersRepository = new InMemoryUsersRepository();
    sut = new GetUserCheckInsMetricsUseCase(
      checkInsRepository,
      usersRepository
    );
  });

  it('should be able get all user checkin metrics correctly with any checkin created', async () => {
    const _USER_ID = 'user-id-01';

    await usersRepository.create({
      id: _USER_ID,
      email: 'some@email.com',
      name: 'Jhon Doe',
      password_hash: await hash('123456', 8),
    });

    const { metrics: metrics1 } = await sut.execute({
      userId: _USER_ID,
    });

    expect(metrics1).toBeTypeOf('number');
    expect(metrics1).toBe(0);

    // Make some checkins and test again

    await checkInsRepository.create({
      gym_id: 'some-gym',
      user_id: _USER_ID,
    });

    await checkInsRepository.create({
      gym_id: 'some-gym',
      user_id: _USER_ID,
    });

    const { metrics: metrics2 } = await sut.execute({
      userId: _USER_ID,
    });

    expect(metrics2).toBeTypeOf('number');
    expect(metrics2).toBe(2);
  });

  it('should be able get all user checkin metrics correctly with 2 checkins created', async () => {
    const _USER_ID = 'user-id-01';

    await usersRepository.create({
      id: _USER_ID,
      email: 'some@email.com',
      name: 'Jhon Doe',
      password_hash: await hash('123456', 8),
    });

    await checkInsRepository.create({
      gym_id: 'some-gym',
      user_id: _USER_ID,
    });

    await checkInsRepository.create({
      gym_id: 'some-gym',
      user_id: _USER_ID,
    });

    const { metrics } = await sut.execute({
      userId: _USER_ID,
    });

    expect(metrics).toBeTypeOf('number');
    expect(metrics).toBe(2);
  });

  it('should not be able get checkIn metrics to a non exists user', async () => {
    await expect(
      sut.execute({
        userId: 'any-user-id',
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
