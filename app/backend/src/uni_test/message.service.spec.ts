import { MessageService } from '../service/service.message';
import { PrismaClient } from '@prisma/client';


describe('MessageService', () => {
    let messageService: MessageService;
    let prismaClient;
  
    beforeEach(() => {
      prismaClient = {
        message: {
          create: jest.fn(),
        },
      };
      messageService = new MessageService(prismaClient);
    });
  
    it('should create a message', async () => {
      const messageData = {
        content: "Hello World",
        date: new Date(),
        sender_id: 123,
      };
  
      const expectedMessage = {
        id: 1,
        ...messageData,
      };
  
      prismaClient.message.create.mockResolvedValue(expectedMessage); // Mock la fonction create de prismaClient.message
  
      const result = await messageService.create(messageData);
  
      expect(prismaClient.message.create).toHaveBeenCalledWith({ data: messageData });
      expect(result).toEqual(expectedMessage);
    });
  
    // Ajoutez d'autres tests au besoin
  });
  