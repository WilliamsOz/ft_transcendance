import { Bann_Service } from './bann.service';
import { PrismaClient } from '@prisma/client';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('Bann_Service', () => {
  let bann_Service: Bann_Service;
  let prismaClient: PrismaClient;

  beforeEach(async () => {
    prismaClient = new PrismaClient();
    bann_Service = new Bann_Service(prismaClient);
  });

  it('should create a new bann', async () => {
    const futureDate = new Date();
    futureDate.setHours(futureDate.getHours() + 1); // Définir un temps dans le futur

    const mockBannData = { channel_id: 1, user_id: 1, unban_time: futureDate };
    const mockBann = { id: 1, ...mockBannData };

    jest.spyOn(prismaClient.user, 'findUnique').mockResolvedValue({
      id: mockBann.id,
      login42: '',
      email: '',
      image_url: '',
      name: '',
      status: '',
      password: '',
    });
    jest.spyOn(prismaClient.channel, 'findUnique').mockResolvedValue({
      id: mockBann.id,
      mode: '',
      password: null,
      owner_id: 1,
    });
    jest.spyOn(prismaClient.bann, 'create').mockResolvedValue(mockBann);

    expect(await bann_Service.createBann(mockBannData)).toEqual(mockBann);
  });

  describe('getBann', () => {
    it('should return a specific bann', async () => {
      const futureDate = new Date();
      futureDate.setHours(futureDate.getHours() + 1);

      const mockBann = {
        id: 1,
        user_id: 1,
        channel_id: 2,
        unban_time: futureDate,
      };
      const mockUser = {
        id: 1,
        login42: '',
        email: '',
        image_url: '',
        name: '',
        status: '',
        password: '',
      }; // Mock User

      jest.spyOn(prismaClient.user, 'findUnique').mockResolvedValue(mockUser); // Mock User call
      jest.spyOn(prismaClient.bann, 'findUnique').mockResolvedValue(mockBann);

      expect(await bann_Service.getBann(1)).toEqual(mockBann);
    });

    describe('updateBann', () => {
      it('should update a bann', async () => {
        const futureDate = new Date();
        futureDate.setHours(futureDate.getHours() + 1);
        const updateData = { unban_time: futureDate };
        const updatedBann = { id: 1, user_id: 1, channel_id: 2, ...updateData };
        jest
          .spyOn(prismaClient.bann, 'findUnique')
          .mockResolvedValue(updatedBann);
        jest.spyOn(prismaClient.bann, 'update').mockResolvedValue(updatedBann);

        expect(await bann_Service.updateBann(1, updateData)).toEqual(
          updatedBann,
        );
      });
    });

    describe('deleteBann', () => {
      it('should delete a bann', async () => {
        const mockBann = {
          id: 1,
          user_id: 1,
          channel_id: 2,
          unban_time: new Date(),
        };

        jest.spyOn(prismaClient.bann, 'findUnique').mockResolvedValue(mockBann);
        jest.spyOn(prismaClient.bann, 'delete').mockResolvedValue(mockBann);

        expect(await bann_Service.deleteBann(1)).toEqual(mockBann);
      });
    });
  });
  describe('getAllBanns', () => {
    it('should return all banns', async () => {
      const mockBanns = [
        { id: 1, user_id: 1, channel_id: 2, unban_time: new Date() },
      ];

      jest.spyOn(prismaClient.bann, 'findMany').mockResolvedValue(mockBanns);

      expect(await bann_Service.getAllBanns()).toEqual(mockBanns);
    });

    // ... tests supplémentaires si nécessaire
  });
});
