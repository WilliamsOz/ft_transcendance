import { Injectable } from '@nestjs/common';
import { PrismaClient, Game} from '@prisma/client';

@Injectable()
export class GameService 
{ // Service pour les jeux
    constructor(private readonly prisma: PrismaClient) {}
    
    async create(data: any): Promise<Game | null > { // Creer un utilisateur
        return await this.prisma.game.create({
          data,
        });
    }
    
    async delete (id: number): Promise<Game | null> { // Supprimer un utilisateur
        return await this.prisma.game.delete({
          where: { id },
        });
    }
    
    async update(id: number, data: any): Promise<Game | null> 
    {
        return await this.prisma.game.update({
          where: { id },
          data,
        });
    }

    async findbyId(id: number): Promise<Game | null> 
    { // Recuperer un jeu par son id
        return await this.prisma.game.findUnique({
          where: { id },
        });
    }
    // Je recupere les jeux de l'utilisateur par son ID 
    async findGamesByUserId(userId: number): Promise<Game[]> 
    {
      return await this.prisma.game.findMany({ 
        where: {
          OR: [
            { user_id_1: userId },
            { user_id_2: userId }
          ],
        },
      });
   }
   
}