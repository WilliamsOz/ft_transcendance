import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UserService } from './service/service.user';

async function main() {
  const prisma = new PrismaClient();
  const userService = new UserService(prisma);

  try {
    const newUser = {
      id: 2,
      login42: 'momo',
      name: 'babar',
      status: 'en ligne',
      image_url: 'https://cdn.intra.42.fr/users/babar.jpg',
      email: 'babar@example.com',
      password: 'lol321312',
    };

    const createdUser = await userService.create(newUser);
    console.log('Utilisateur créé :', createdUser);
  } catch (error) {
    console.error('Erreur lors de la création de l’utilisateur :', error);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  throw e;
});
