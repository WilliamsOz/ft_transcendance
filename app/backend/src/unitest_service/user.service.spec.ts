import { NotFoundException } from '@nestjs/common';
import { UserService } from '../service/user/user.service';
import { PrismaClient, User } from '@prisma/client';

describe('UserService', () => {
  let userService: UserService;
  let prismaClient: PrismaClient;

  beforeEach(async () => {
    // Créer une instance du PrismaClient mock (faux)
    prismaClient = new PrismaClient();

    // Créer une instance de votre UserService, en injectant le PrismaClient mock
    userService = new UserService(prismaClient);
  });

  afterEach(async () => {
    // Assurez-vous de vider les mocks entre chaque test
    jest.clearAllMocks();
  });

  describe('create an user', () => {
    it('should create a user', async () => {
      const userData = {
        id: 1,
        login42: 'testLogin42',
        email: 'test@hotmail.ft',
        image_url: 'http://example.com/image.jpg',
        name: 'Test User',
        status: 'online',
        password: 'testPassword',
      };

      const expectedUser = {
        ...userData,
      };

      jest.spyOn(prismaClient.user, 'create').mockResolvedValue(expectedUser);

      const user = await userService.create(userData);

      expect(user).toEqual(expectedUser);
      expect(prismaClient.user.create).toHaveBeenCalledWith({ data: userData });
    });
  });

  describe('Test finding user by his login42', () => {
    it('should find a user by login42', async () => {
      const login42 = 'testLogin42';
      const expectedUser = {
        id: 1,
        login42: 'testLogin42',
        email: 'test@email.com',
        image_url: 'http://example.com/image.jpg',
        name: 'Test User',
        status: 'online',
        password: 'testPassword',
      };
      jest
        .spyOn(prismaClient.user, 'findUnique')
        .mockResolvedValue(expectedUser);

      const user = await userService.findOne(login42);

      expect(user).toEqual(expectedUser);
      expect(prismaClient.user.findUnique).toHaveBeenCalledWith({
        where: { login42 },
      });
    });

    describe('Test error user does not exist in db', () => {
      it('should handle errors during user creation', async () => {
        const userData = {
          id: 1,
          login42: 'testLogin42',
          email: 'test@hotmail.ft',
          image_url: 'http://example.com/image.jpg',
          name: 'Test User',
          status: 'online',
          password: 'testPassword',
        };

        const errorMessage = 'Failed to create user';

        jest
          .spyOn(prismaClient.user, 'create')
          .mockRejectedValue(new Error(errorMessage));

        await expect(userService.create(userData)).rejects.toThrow(
          errorMessage,
        );
        expect(prismaClient.user.create).toHaveBeenCalledWith({
          data: userData,
        });
      });

      it('should return null if the user does not exist', async () => {
        const login42 = 'nonExistingUser';

        jest
          .spyOn(prismaClient.user, 'findUnique')
          .mockRejectedValue(
            new NotFoundException('User not found with login42'),
          );

        await expect(userService.findOne(login42)).rejects.toThrowError(
          NotFoundException,
        );
        expect(prismaClient.user.findUnique).toHaveBeenCalledWith({
          where: { login42 },
        });
      });

      it('should handle errors during user lookup', async () => {
        const login42 = 'testLogin42';
        const errorMessage = 'Database error';

        jest
          .spyOn(prismaClient.user, 'findUnique')
          .mockRejectedValue(new Error(errorMessage));

        await expect(userService.findOne(login42)).rejects.toThrow(
          errorMessage,
        );
        expect(prismaClient.user.findUnique).toHaveBeenCalledWith({
          where: { login42 },
        });
      });
    });
  });
});
