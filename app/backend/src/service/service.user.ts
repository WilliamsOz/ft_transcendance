import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, PrismaClient, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaClient) {}

  // Cette fonction est une méthode asynchrone appelée 'findOne'
  async create(data: any): Promise<User | null> {
    try {
      // Validez les données d'entrée (par exemple, assurez-vous que les champs obligatoires sont présents)

      // Hacher le mot de passe
      const saltRounds = 10; // Vous pouvez ajuster ce nombre en fonction de vos besoins
      const hashedPassword = await bcrypt.hash(data.password, saltRounds);

      // Remplacer le mot de passe clair par le mot de passe haché
      data.password = hashedPassword;

      // Créer l'utilisateur avec le mot de passe haché
      const createdUser = await this.prisma.user.create({
        data,
      });

      // Vérifiez si l'utilisateur a été créé avec succès
      if (!createdUser) {
        throw new Error('Failed to create user'); // Vous pouvez personnaliser le message d'erreur
      }

      return createdUser;
    } catch (error) {
      // Gérez les erreurs spécifiques et lancez des exceptions appropriées
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new NotFoundException('User already exists');
        }
      }

      throw new Error('Failed to create user'); // Gérez les autres erreurs ici
    }
  }

  async update(id: number, data: any): Promise<User> {
    // Mettre à jour un utilisateur
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found'); // ou throw new NotFoundException('User not found');
    }
    return await this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('User id not found'); // ou throw new NotFoundException('User not found');
    }
    return await this.prisma.user.delete({
      where: { id },
    });
  }

  async findOne(login42: string): Promise<User> {
    // Recuperer un utilisateur par son login42
    const user = await this.prisma.user.findUnique({
      where: { login42 },
    });
    if (!user) {
      throw new NotFoundException('User not found with login42'); // ou throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    // Recuperer un utilisateur par son email
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new NotFoundException('User not found with email'); // ou throw new NotFoundException('User not found');
    }
    return user;
  }

  async findById(id: number): Promise<User> {
    // Recuperer un utilisateur par son id
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('User not found with id'); // ou throw new NotFoundException('User not found');
    }
    return user;
  }

  async FindUserWithGames(userId: number) {
    // Recuperer les jeux de l'utilisateur
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('User not found'); // ou throw new NotFoundException('User not found');
    }

    return await this.prisma.user.findUnique({
      where: { id: userId }, // Recherchez l'utilisateur par son 'id'
      include: {
        // Inclure les relations 'user_1' et 'user_2' de la table 'game'
        user_1: true, // Je recupere la table liee a user_1 et user_2 grace a include
        user_2: true,
      },
    });
  }

  async isUserInGame(userId: number) {
    const userWithGames = await this.FindUserWithGames(userId);
    if (userWithGames == null) {
      throw new NotFoundException('User not found'); // ou throw new NotFoundException('User not found');
    }
    // Vérifiez si l'utilisateur est en jeu en vérifiant les relations user_1 et user_2
    if (userWithGames.user_1.length > 0 || userWithGames.user_2.length > 0) {
      return true; // L'utilisateur est en jeu
    } else {
      return false; // L'utilisateur n'est pas en jeu
    }
  }

  async findAllUserFriends(userId: number) {
    // Recuperer les amis de l'utilisateur
    // Trouver les amis où l'utilisateur est 'user_id_1'
    const friendsPart1 = await this.prisma.friends.findMany({
      where: { user_id_1: userId },
      include: {
        user_friend_2: true, // Inclure les détails de l'ami correspondant à 'user_id_2'
      },
    });

    const friendsPart2 = await this.prisma.friends.findMany({
      where: { user_id_2: userId },
      include: {
        user_friend_1: true, // Inclure les détails de l'ami correspondant à 'user_id_1'
      },
    });

    // Fusionner et transformer les résultats pour obtenir une liste unique d'amis
    const allFriends = [
      ...friendsPart1.map((friend) => friend.user_friend_2),
      ...friendsPart2.map((friend) => friend.user_friend_1),
    ];

    return allFriends;
  }
}
