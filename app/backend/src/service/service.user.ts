import { Injectable } from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UserService 
{
  constructor(private readonly prisma: PrismaClient) {}
  
  static findAllUserFriends(userId: number) {
      throw new Error('Method not implemented.');
  }
  // Cette fonction est une méthode asynchrone appelée 'findOne'
  async create(data: any): Promise<User | null > {
    // Hacher le mot de passe
    const saltRounds = 10; // Vous pouvez ajuster ce nombre en fonction de vos besoins
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);
  
    // Remplacer le mot de passe clair par le mot de passe haché
    data.password = hashedPassword;
  
    // Créer l'utilisateur avec le mot de passe haché
    return await this.prisma.user.create({
      data,
    });
  }

  async update(id: number, data: any): Promise<User | null> { // Mettre à jour un utilisateur
    return await this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<User | null> { // Supprimer un utilisateur
    return await this.prisma.user.delete({
      where: { id },
    });
  }

  
  async findOne(login42: string): Promise<User | null> { // Recuperer un utilisateur par son login42
    // Elle utilise 'prisma' (un ORM pour gérer la base de données) pour chercher un utilisateur unique
    return await this.prisma.user.findUnique({
      // La recherche se fait sur la base du 'login42' fourni en paramètre
      where: { login42 },
    });
  }
  async findByEmail(email: string): Promise<User | null> { // Recuperer un utilisateur par son email
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }
  
  async findById(id: number): Promise<User | null> { // Recuperer un utilisateur par son id
    return await this.prisma.user.findUnique({
      where: { id },
    });
  }


  async FindUserWithGames(userId: number) { // Recuperer les jeux de l'utilisateur
    return await this.prisma.user.findUnique({
      where: { id: userId }, // Recherchez l'utilisateur par son 'id'
      include: { // Inclure les relations 'user_1' et 'user_2' de la table 'game'
        user_1: true, // Je recupere la table liee a user_1 et user_2 grace a include
        user_2: true,
      },
    });
  }

  async isUserInGame(userId: number) 
  {
    const userWithGames = await this.FindUserWithGames(userId);
    // Vérifiez si l'utilisateur est en jeu en vérifiant les relations user_1 et user_2
    if (userWithGames.user_1.length > 0 || userWithGames.user_2.length > 0) {
      return true; // L'utilisateur est en jeu
    } 
    else 
    {
      return false; // L'utilisateur n'est pas en jeu
    }
  }

  async findAllUserFriends(userId: number) // Recuperer les amis de l'utilisateur
  {
    // Trouver les amis où l'utilisateur est 'user_id_1'
    const friendsPart1 = await this.prisma.friends.findMany({
      where: { user_id_1: userId },
      include: {
        user_friend_2: true // Inclure les détails de l'ami correspondant à 'user_id_2'
      }
    });

    const friendsPart2 = await this.prisma.friends.findMany({
      where: { user_id_2: userId },
      include: {
        user_friend_1: true // Inclure les détails de l'ami correspondant à 'user_id_1'
      }
    });

    // Fusionner et transformer les résultats pour obtenir une liste unique d'amis
    const allFriends = [...friendsPart1.map(friend => friend.user_friend_2), 
                        ...friendsPart2.map(friend => friend.user_friend_1)];

    return allFriends;
  }

}