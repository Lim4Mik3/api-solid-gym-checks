import { User, Prisma } from '@prisma/client';
import { randomUUID } from 'node:crypto';
import { UsersRepository } from '../users-repository';

export class InMemoryUsersRepository implements UsersRepository {
  private items: User[] = [];

  async findById(userId: string): Promise<User | null> {
    const user = this.items.find((user) => user.id === userId);

    if (!user) {
      return null;
    }

    return user;
  }

  async findByEmail(email: string) {
    const user = this.items.find((user) => user.email === email);

    if (!user) {
      return null;
    }

    return user;
  }

  async create(data: Prisma.UserCreateInput) {
    const user = {
      id: data.id ?? randomUUID(),
      created_at: new Date(),
      email: data.email,
      name: data.name,
      password_hash: data.password_hash,
    };

    this.items.push(user);

    return user;
  }
}
