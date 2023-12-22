import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, PrismaClient, User, Friends } from '@prisma/client';

@Injectable()
export class FriendService {
  constructor(private readonly prisma: PrismaClient) {} // Injectez le client Prisma

  // Create
  async createFriendship(data: { user_id_1: number; user_id_2: number }) {
    const user1 = await this.prisma.user.findUnique({
      where: { id: data.user_id_1 },
    });
    if (!user1) {
      throw new NotFoundException('User not found');
    }
    const user2 = await this.prisma.user.findUnique({
      where: { id: data.user_id_2 },
    });
    if (!user2) {
      throw new NotFoundException('User not found');
    }
    return this.prisma.friends.create({
      data,
    });
  }

  // Read (Get a specific friendship)
  async getFriendship(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (id < 0) throw new NotFoundException('Id must be positive');

    const friendship = await this.prisma.friends.findUnique({
      where: { id },
    });

    if (!friendship) {
      throw new NotFoundException(`Friendship with ID ${id} not found`);
    }

    return friendship;
  }

  // Delete
  async deleteFriendship(id: number) {
    const friendship = await this.prisma.friends.findUnique({
      where: { id },
    });
    if (!friendship) {
      throw new NotFoundException('Friendship not found');
    }
    return this.prisma.friends.delete({
      where: { id },
    });
  }

  // List all friendships (optional)
  async getAllFriendships() {
    return this.prisma.friends.findMany();
  }
}
