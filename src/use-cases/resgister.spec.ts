import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { UsersRepository } from '@/repositories/users-repository';
import { compare } from 'bcryptjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';
import { RegisterUseCase } from './register';

let usersRepository: UsersRepository;
let sut: RegisterUseCase;

describe('Register Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new RegisterUseCase(usersRepository);
  });

  it('should be able to register', async () => {
    const { user } = await sut.execute({
      name: 'Jhon Doe',
      email: 'jhondoe@gmail.com',
      password: 'my-secret-password',
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it('should hash user password upon registration', async () => {
    const { user } = await sut.execute({
      name: 'Jhon Doe',
      email: 'jhondoe@gmail.com',
      password: 'my-secret-password',
    });

    const isPasswordCorrectlyHashed = await compare(
      'my-secret-password',
      user.password_hash
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it('should not be able to register with same email twice', async () => {
    const email = 'jhondoe@gmail.com';

    await sut.execute({
      name: 'Jhon Doe',
      email,
      password: 'my-secret-password',
    });

    await expect(() =>
      sut.execute({
        name: 'Jhon Doe',
        email,
        password: 'my-secret-password',
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
