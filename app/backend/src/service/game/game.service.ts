import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient, Game } from '@prisma/client';

@Injectable()
export class GameService {
  // Service pour les jeux
  constructor(private readonly prisma: PrismaClient) {}

  async create(id: number, data: any): Promise<Game | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('User id not found'); // ou throw new NotFoundException('User not found');
    }
    return await this.prisma.game.create({
      data,
    });
  }

  async delete(id: number): Promise<Game | null> {
    // Vérifiez si le jeu existe
    const game = await this.prisma.game.findUnique({
      where: { id },
    });

    if (!game) {
      // Le jeu n'existe pas, vous pouvez lever une exception ou renvoyer null
      throw new NotFoundException('Game id not found');
    }
    // Supprimez le jeu s'il existe et que l'utilisateur a les autorisations nécessaires
    const deletedGame = await this.prisma.game.delete({
      where: { id },
    });

    return deletedGame;
  }

  async update(id: number, data: any): Promise<Game | null> {
    const game = await this.prisma.game.findUnique({
      where: { id },
    });

    if (!game) {
      // Le jeu n'existe pas, vous pouvez lever une exception ou renvoyer null
      throw new NotFoundException('Game id not found');
    }
    return await this.prisma.game.update({
      where: { id },
      data,
    });
  }

  async findbyId(id: number): Promise<Game | null> {
    // Recuperer un jeu par son id
    const user = await this.prisma.game.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('Game id not found'); // ou throw new NotFoundException('User not found');
    }
    return user;
  }
  // Je recupere les jeux de l'utilisateur par son ID
  async findGamesByUserId(userId: number): Promise<Game[] | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return await this.prisma.game.findMany({
      where: {
        OR: [{ user_id_1: userId }, { user_id_2: userId }],
      },
    });
  }
}
