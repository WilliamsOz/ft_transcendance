import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, PrismaClient, Mutes } from '@prisma/client';

@Injectable()
export class MutesService {
  constructor(private prisma: PrismaClient) {}

  async createMute(data: any): Promise<Mutes> {
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

    if (data.unmute_time < new Date()) {
      throw new NotFoundException('Unmute time must be in the future');
    }

    return this.prisma.mutes.create({
      data,
    });
  }

  async getMute(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (id < 0) throw new NotFoundException('Id must be positive');

    return this.prisma.mutes.findUnique({
      where: { id },
    });
  }

  async updateMute(id: number, data: { unmute_time: Date }) {
    const mute = await this.prisma.mutes.findUnique({
      where: { id },
    });
    if (!mute) {
      throw new NotFoundException('Mute not found');
    }
    if (data.unmute_time < new Date()) {
      throw new NotFoundException('Unmute time must be in the future');
    }

    return this.prisma.mutes.update({
      where: { id },
      data: { unmutetime: data.unmute_time },
    });
  }

  async deleteMute(id: number) {
    const mute = await this.prisma.mutes.findUnique({
      where: { id },
    });
    if (!mute) {
      throw new NotFoundException('Mute not found');
    }
    return this.prisma.mutes.delete({
      where: { id },
    });
  }

  async getMutesByUser(user_id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: user_id },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.prisma.mutes.findMany({
      where: { user_id },
    });
  }
}
