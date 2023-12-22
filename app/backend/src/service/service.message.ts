import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaClient, Message, Prisma } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class MessageService {
  // Service pour les messages
  constructor(private readonly prisma: PrismaClient) {} // Injection de dépendance

  async create(data: any): Promise<Message | null> {
    if (typeof data.id !== 'number' || data.id <= 0) {
      throw new BadRequestException("ID de l'utilisateur invalide");
    }

    // Recherchez l'utilisateur par son ID
    const user = await this.prisma.user.findUnique({
      where: { id: data.id },
    });

    // Vérifiez si l'utilisateur existe
    if (!user) {
      throw new NotFoundException("L'utilisateur avec cet ID n'existe pas");
    }

    // Vérifiez la longueur du contenu du message
    if (data.content.length > 1000) {
      throw new BadRequestException('Le texte du message est invalide');
    }

    const message = await this.prisma.message.create({
      data: {
        ...data,
        sender: {
          connect: { id: user.id },
        },
      },
    });

    return message;
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
