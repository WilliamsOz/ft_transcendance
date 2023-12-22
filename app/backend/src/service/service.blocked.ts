import { Injectable, NotFoundException } from '@nestjs/common';
import { Blocked, PrismaClient } from '@prisma/client';

@Injectable()
export class BlockedService {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: number): Promise<Blocked | null> {
    const user = await this.prisma.blocked.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('Blocked id not found'); // ou throw new NotFoundException('User not found');
    }
    return await this.prisma.blocked.findUnique({
      where: { id },
    });
  }

  async find_Blocked_user(id: number): Promise<Blocked | null> {
    const user = await this.prisma.blocked.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('Blocked id not found'); // ou throw new NotFoundException('User not found');
    }

    return await this.prisma.blocked.findUnique({
      where: { id },
    });
  }

  async find_Blocker_user(id: number): Promise<Blocked | null> {
    const user = await this.prisma.blocked.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('Blocked id not found'); // ou throw new NotFoundException('User not found');
    }
    return await this.prisma.blocked.findUnique({
      where: { id },
    });
  }

  async create(data: any): Promise<Blocked | null> {
    const user = await this.prisma.blocked.findUnique({
      where: { id: data.blocker_id },
    });

    if (!user) {
      throw new NotFoundException('Blocked id not found'); // ou throw new NotFoundException('User not found');
    }

    return await this.prisma.blocked.create({
      data,
    });
  }
}
