import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, PrismaClient, User, Bann } from '@prisma/client';

@Injectable()
export class Bann_Service {
  constructor(private readonly prisma: PrismaClient) {} // Injectez le client Prisma

  // Create
  async createBann(data: {
    channel_id: number;
    user_id: number;
    unban_time: Date;
  }) {
    const user = await this.prisma.user.findUnique({
      where: { id: data.user_id },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const channel = await this.prisma.channel.findUnique({
      where: { id: data.channel_id },
    });
    if (!channel) {
      throw new NotFoundException('Channel not found');
    }

    if (data.unban_time < new Date()) {
      throw new NotFoundException('Unban time must be in the future');
    }
    return this.prisma.bann.create({
      data,
    });
  }

  // Read (Get a specific bann)
  async getBann(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (id < 0) throw new NotFoundException('Id must be positive');

    return this.prisma.bann.findUnique({
      where: { id },
    });
  }

  // Update
  async updateBann(id: number, data: { unban_time: Date }) {
    const bann = await this.prisma.bann.findUnique({
      where: { id },
    });
    if (!bann) {
      throw new NotFoundException('Bann not found');
    }
    if (data.unban_time < new Date()) {
      throw new NotFoundException('Unban time must be in the future');
    }

    return this.prisma.bann.update({
      where: { id },
      data,
    });
  }

  // Delete
  async deleteBann(id: number) {
    const bann = await this.prisma.bann.findUnique({
      where: { id },
    });
    if (!bann) {
      throw new NotFoundException('Bann not found');
    }
    if (id < 0) throw new NotFoundException('Id must be positive');
    return this.prisma.bann.delete({
      where: { id },
    });
  }

  // List all banns (optional)
  async getAllBanns() {
    return this.prisma.bann.findMany();
  }
}
