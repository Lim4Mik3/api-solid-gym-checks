import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { UsersRepository } from '@/repositories/users-repository';
import { hash } from 'bcryptjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { ResourceNotFoundError } from './errors/resource-not-found';
import { GetUserProfileUseCase } from './get-user-profile';

let usersRepository: UsersRepository;
let sut: GetUserProfileUseCase;

describe('Get User Profile Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new GetUserProfileUseCase(usersRepository);
  });

  it('should be able get a user profile', async () => {
    const createdUser = await usersRepository.create({
      name: 'Jhon Doe',
      email: 'jhon@gmail.com',
      password_hash: await hash('my-secret-passwor', 8),
    });

    const { user } = await sut.execute({ userId: createdUser.id });

    expect(user.name).toEqual('Jhon Doe');
    expect(user.id).toEqual(createdUser.id);
  });

  it('should not be able to get a user profile with a non exists ID', async () => {
    await expect(() =>
      sut.execute({ userId: 'non-exists-id' })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
