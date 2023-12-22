import { FriendService } from './friend.service';
import { PrismaClient } from '@prisma/client';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('FriendService', () => {
  let friendService: FriendService;
  let prismaClient: PrismaClient;

  beforeEach(async() => {
    prismaClient = new PrismaClient();
    friendService = new FriendService(prismaClient);
  });
  describe('createFriendship', () => {
    it('should create a new friendship', async () => {
      const friendData = { user_id_1: 1, user_id_2: 2 };
      const mockFriendship = { id: 1, ...friendData };
  
      jest.spyOn(prismaClient.user, 'findUnique')
        .mockResolvedValueOnce({ id: friendData.user_id_1, login42: '', email: '', image_url: '', name: '', status: '', password: '' }) // Mock pour user_id_1
        .mockResolvedValueOnce({ id: friendData.user_id_2, login42: '', email: '', image_url: '', name: '', status: '', password: '' }); // Mock pour user_id_2
  
      jest.spyOn(prismaClient.friends, 'create').mockResolvedValue(mockFriendship);
  
      expect(await friendService.createFriendship(friendData)).toEqual(mockFriendship);
    });
  });
 describe('deleteFriendship', () => {
    it('should delete a friendship', async () => {
      const mockFriendship = { id: 1, user_id_1: 1, user_id_2: 2 };
  
      jest.spyOn(prismaClient.friends, 'findUnique').mockResolvedValue(mockFriendship);
      jest.spyOn(prismaClient.friends, 'delete').mockResolvedValue(mockFriendship);
  
      expect(await friendService.deleteFriendship(1)).toEqual(mockFriendship);
    });
  });
  
});
