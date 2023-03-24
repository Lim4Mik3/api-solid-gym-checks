import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { hash } from 'bcryptjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { AuthenticateUseCase } from './authenticate';
import { InvalidCredentialsError } from '../errors/invalid-credentials-error';
import { UsersRepository } from '@/repositories/UsersRepository';

let usersRepository: UsersRepository;
let sut: AuthenticateUseCase;

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new AuthenticateUseCase(usersRepository);
  });

  it('should be able to authenticate', async () => {
    await usersRepository.create({
      name: 'Jhon Doe',
      email: 'jhondoe@gmail.com',
      password_hash: await hash('my-secret-password', 8),
    });

    const { user } = await sut.execute({
      email: 'jhondoe@gmail.com',
      password: 'my-secret-password',
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it('should not be able to authenticate with wrong email', async () => {
    await expect(() =>
      sut.execute({
        email: 'jhondoe@gmail.com',
        password: 'any-password',
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it('should not be able to authenticate with wrong password', async () => {
    await usersRepository.create({
      name: 'Jhon Doe',
      email: 'jhondoe@gmail.com',
      password_hash: await hash('my-secret-password', 8),
    });

    await expect(() =>
      sut.execute({
        email: 'jhondoe@gmail.com',
        password: 'wrong-password',
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
