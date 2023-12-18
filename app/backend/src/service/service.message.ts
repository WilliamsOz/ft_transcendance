import { Injectable } from '@nestjs/common';
import { PrismaClient, Message } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class MessageService {
  // Service pour les messages
  constructor(private readonly prisma: PrismaClient) {} // Injection de dépendance

  async create(data: any): Promise<Message | null> {
    // Creer un message
    return await this.prisma.message.create({
      data,
    });
  }

  async delete(id: number): Promise<Message | null> {
    // Supprimer un message
    const user = await this.prisma.message.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('Message id not found'); // ou throw new NotFoundException('User not found');
    }
    return await this.prisma.message.delete({
      where: { id },
    });
  }

  async update(id: number, data: any): Promise<Message | null> {
    // Mettre à jour un message
    const user = await this.prisma.message.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('Message id not found'); // ou throw new NotFoundException('User not found');
    }
    return await this.prisma.message.update({
      where: { id },
      data,
    });
  }

  async findById(id: number): Promise<Message | null> {
    const message = await this.prisma.message.findUnique({
      where: { id },
    });

    if (!message) {
      throw new NotFoundException(`Message with ID ${id} not found.`);
    }
    return message;
  }
}
