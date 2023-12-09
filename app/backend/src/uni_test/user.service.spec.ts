import { UserService } from '../service/service.user';
import { PrismaClient } from '@prisma/client';

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
      
    it('should find an existing user by login42', async () => {
        const login42 = 'existingUser';
        const expectedUser = {
          id: 2,
          login42: 'existingUser',
          email: 'existing@email.com',
          image_url: 'http://example.com/existing_image.jpg',
          name: 'Existing User',
          status: 'online',
        };
      
        jest.spyOn(prismaClient.user, 'findUnique').mockResolvedValue(expectedUser);
      
        const user = await userService.findOne(login42);
      
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

  
  // Ajouter plus de tests pour d'autres scénarios et méthodes
});
