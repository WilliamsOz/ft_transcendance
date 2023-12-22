import { MutesService } from './mutes.service';
import { PrismaClient } from '@prisma/client';

describe('MutesService', () => {
  let mutesService: MutesService;
  let prismaClient: PrismaClient;

  beforeEach(() => {
    prismaClient = new PrismaClient();
    mutesService = new MutesService(prismaClient);
  });
  

  it('should create a new mute', async () => {
    const futureDate = new Date();
    futureDate.setHours(futureDate.getHours() + 1);

    const mockMuteData = { channel_id: 1, user_id: 1, unmutetime: futureDate };
    const mockMute = { id: 1, ...mockMuteData };

    jest
      .spyOn(prismaClient.user, 'findUnique')
      .mockResolvedValue({
        id: mockMute.id,
        login42: 'yonix',
        email: '',
        image_url: '',
        name: '',
        status: '',
        password: '',
      });
    jest
      .spyOn(prismaClient.channel, 'findUnique')
      .mockResolvedValue({
        id: mockMute.id,
        mode: '',
        password: null,
        owner_id: 1,
      });
    jest.spyOn(prismaClient.mutes, 'create').mockResolvedValue(mockMute);

    expect(await mutesService.createMute(mockMuteData)).toEqual(mockMute);
  });
  describe('getMute test', () => {
    it('should return a specific mute', async () => {
      const futureDate = new Date();
      futureDate.setHours(futureDate.getHours() + 1);
      const mockMute = {
        id: 1,
        user_id: 1,
        channel_id: 2,
        unmutetime: futureDate,
      };
      const mockUser = { id: 1, name: 'Test User', email: 'test@example.com', image_url: '', login42: '', status: '', password: '',  }; // Mock User
  
      jest.spyOn(prismaClient.user, 'findUnique').mockResolvedValue(mockUser);
      jest.spyOn(prismaClient.mutes, 'findUnique').mockResolvedValue(mockMute);
  
      expect(await mutesService.getMute(1)).toEqual(mockMute);
    });

    describe('deleteMute', () => {
      it('should delete a mute', async () => {
        const futureDate = new Date();
        futureDate.setHours(futureDate.getHours() + 1);
        const mockMute = {
          id: 1,
          user_id: 1,
          channel_id: 2,
          unmutetime: futureDate,
        };

        jest
          .spyOn(prismaClient.mutes, 'findUnique')
          .mockResolvedValue(mockMute);
        jest.spyOn(prismaClient.mutes, 'delete').mockResolvedValue(mockMute);

        expect(await mutesService.deleteMute(1)).toEqual(mockMute);
      });
    });
  });
});
