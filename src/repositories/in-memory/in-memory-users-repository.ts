import { User, Prisma } from '@prisma/client';
import { UsersRepository } from '../UsersRepository';

export class InMemoryUsersRepository implements UsersRepository {
  private items: User[] = [];

  async findByEmail(email: string) {
    const user = this.items.find((user) => user.email === email);

    if (!user) {
      return null;
    }

    return user;
  }

  async create(data: Prisma.UserCreateInput) {
    const user = {
      id: Math.floor(100 * Math.random()).toString(),
      created_at: new Date(),
      email: data.email,
      name: data.name,
      password_hash: data.password_hash,
    };

    this.items.push(user);

    return user;
  }
}
