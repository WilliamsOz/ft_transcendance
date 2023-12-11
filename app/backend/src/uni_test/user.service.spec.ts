import { UserService, } from '../service/service.user';
import { PrismaClient } from '@prisma/client';
import { GameService } from 'src/service/service.game';
describe('UserService', () => {
  let userService: UserService;
  let prismaClient: PrismaClient;

    beforeEach(async () => {
      // Créer une instance du PrismaClient mock (faux)
      prismaClient = new PrismaClient();

      // Créer une instance de votre UserService, en injectant le PrismaClient mock
      userService = new UserService(prismaClient);
    });

    it('should find a user by login42', async () => {
      const login42 = 'testLogin42';
      const expectedUser = {
        id: 1, // Assurez-vous que c'est un identifiant valide pour vos tests
        login42: 'testLogin42',
        email: 'test@email.com',
        image_url: 'http://example.com/image.jpg',
        name: 'Test User',
        status: 'online',
      };
      jest.spyOn(prismaClient.user, 'findUnique').mockResolvedValue(expectedUser);
  
      const user = await userService.findOne(login42);
  
      expect(user).toEqual(expectedUser);
    });
    
    it ('create a user', async () => { // test creation de user 
      const userData = {
        id : 1,
        login42: 'testLogin42',
        email: 'test@hotmail.ft',
        image_url: 'http://example.com/image.jpg',
        name: 'Test User',
        status: 'online',
      };
      
      const expectedUser = {
        id: 1, // Assurez-vous que c'est un identifiant valide pour vos tests
        ...userData, // copie les données de userData Operator Spread(...)
      };
      
      jest.spyOn(prismaClient.user, 'create').mockResolvedValue(expectedUser);
      
      const user = await userService.create(userData);
      
      expect(user).toEqual(expectedUser);
    
    });

    
    it('should return null if the user does not exist', async () => {
      const login42 = 'nonExistingUser';
    
      jest.spyOn(prismaClient.user, 'findUnique').mockResolvedValue(null);
    
      const user = await userService.findOne(login42);
    
      expect(user).toBeNull();
    });

    it('should handle database errors in findOne method', async () => {
      const login42 = 'testLogin42';
      const errorMessage = 'Database error';
    
      jest.spyOn(prismaClient.user, 'findUnique').mockRejectedValue(new Error(errorMessage));
    
      await expect(userService.findOne(login42)).rejects.toThrow(errorMessage);
    });
    
    
    it('should not find a user if login42 is incorrect', async () => {
      const login42 = 'incorrectLogin42';
    
      jest.spyOn(prismaClient.user, 'findUnique').mockResolvedValue(null);
    
      const user = await userService.findOne(login42);
    
      expect(user).toBeNull();
    });

    it('should find a user with games', async () => {
      const userId = 1;
      const expectedUser = {
        id: 1,
        login42: 'testLogin42',
        email: 'test@email.com',
        image_url: 'http://example.com/image.jpg',
        name: 'Test User',
        status: 'online',
        user_1:  [{ id: 1, type: 'Ranked', user_id_1: 1, user_id_2: 2, winner_id: 1 /* autres détails du jeu */ }],
        user_2:  [{ id: 2, type: 'Ranked', user_id_1: 1, user_id_2: 2, winner_id: 1 /* autres détails du jeu */ }],
      };
    
      jest.spyOn(prismaClient.user, 'findUnique').mockResolvedValue(expectedUser);
    
      const userWithGames = await userService.FindUserWithGames(userId);
    
      expect(userWithGames).toEqual(expectedUser);
      expect(prismaClient.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
        include: {
          user_1: true,
          user_2: true,
        },
      });
    });
    

});
