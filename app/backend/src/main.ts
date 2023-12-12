import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UserService } from './service/service.user';

async function main() {
  const prisma = new PrismaClient();
  const userService = new UserService(prisma);

  try {
    const newUser = 
    {
      id : 1,
      login42: 'test',
      name : 'test',
      status : 'en ligne',
      image_url : 'https://cdn.intra.42.fr/users/test.jpg',
      email: 'test@example.com',
      password: 'password123',
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
