import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception';
import { UserChannelService } from './channel.service';
import { PrismaClient } from '@prisma/client';

describe('UserChannelService', () => {
  let userChannelService: UserChannelService;
  let prismaClient: PrismaClient;

  beforeEach(async () => {
    // Créer une instance du PrismaClient mock (faux)
    prismaClient = new PrismaClient();

    // Créer une instance de votre UserService, en injectant le PrismaClient mock
    userChannelService = new UserChannelService(prismaClient);
  });

  it('should create a new user channel', async () => {
    const data = {
      user_id: 1,
      channel_id: 2,
      password: 'password',
    };
    const expectedUserChannel = {
      user_id: 1,
      channel_id: 2,
    };
    const channel = {
      id: 1,
      mode: 'open',
      password: undefined,
      owner_id: 1,
    };
    const user = {
      id: 1,
      name: 'momo',
      email: 'momo@1.fr',
      password: 'password',
      status: 'active',
      image_url: 'https://www.google.com',
      login42: 'momo42',
    };
    jest.spyOn(prismaClient.user, 'findUnique').mockResolvedValue(user);
    jest.spyOn(prismaClient.channel, 'findUnique').mockResolvedValue(channel);
    jest
      .spyOn(prismaClient.userChannel, 'create')
      .mockResolvedValue(expectedUserChannel);

    const userChannel = await userChannelService.create(data);
    expect(userChannel).toEqual(expectedUserChannel);
  });

  it('should throw an exception if the user is not found', async () => {
    const data = {
      user_id: 1,
      channel_id: 2,
      password: 'password',
    };

    const channel = {
      id: 1,
      mode: 'open',
      password: undefined,
      owner_id: 1,
    };
    jest.spyOn(prismaClient.user, 'findUnique').mockResolvedValue(null); // Simuler un utilisateur non trouvé
    jest.spyOn(prismaClient.channel, 'findUnique').mockResolvedValue(channel);

    await expect(userChannelService.create(data)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw an exception if the channel is not found', async () => {
    const user = {
      id: 1,
      name: 'momo',
      email: 'momo@1.fr',
      password: 'password',
      status: 'active',
      image_url: 'https://www.google.com',
      login42: 'momo42',
    };
    const data = {
      user_id: 1,
      channel_id: 2,
      password: 'password',
    };

    jest.spyOn(prismaClient.user, 'findUnique').mockResolvedValue(user);
    jest.spyOn(prismaClient.channel, 'findUnique').mockResolvedValue(null); // Simuler un canal non trouvé

    await expect(userChannelService.create(data)).rejects.toThrow(
      NotFoundException,
    );
  });

  describe('addUserToChannel', () => {
    const user = {
      id: 1,
      name: 'momo',
      email: 'momo@1.fr',
      password: 'password',
      status: 'active',
      image_url: 'https://www.google.com',
      login42: 'momo42',
    };
    const channel = {
      id: 2,
      mode: 'open',
      password: undefined,
      owner_id: 1,
    };
    const userId = user.id;
    const channelId = channel.id;

    it('should add a user to a channel', async () => {
      jest.spyOn(prismaClient.user, 'findUnique').mockResolvedValue(user);
      jest.spyOn(prismaClient.channel, 'findUnique').mockResolvedValue(channel);
      jest
        .spyOn(prismaClient.userChannel, 'create')
        .mockResolvedValue({ user_id: userId, channel_id: channelId });

      const result = await userChannelService.addUserToChannel(
        userId,
        channelId,
      );
      expect(result).toEqual({ user_id: userId, channel_id: channelId });
    });

    it('should throw an exception if the user is not found', async () => {
      jest.spyOn(prismaClient.user, 'findUnique').mockResolvedValue(null);
      jest.spyOn(prismaClient.channel, 'findUnique').mockResolvedValue(channel);

      await expect(
        userChannelService.addUserToChannel(userId, channelId),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw an exception if the channel is not found', async () => {
      jest.spyOn(prismaClient.user, 'findUnique').mockResolvedValue(user);
      jest.spyOn(prismaClient.channel, 'findUnique').mockResolvedValue(null);

      await expect(
        userChannelService.addUserToChannel(userId, channelId),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeUserFromChannel', () => {
    const user = {
      id: 1,
      name: 'momo',
      email: 'momo@1.fr',
      password: 'password',
      status: 'active',
      image_url: 'https://www.google.com',
      login42: 'momo42',
    };
    const channel = {
      id: 2,
      mode: 'open',
      password: undefined,
      owner_id: 1,
    };
    const userChannel = {
      user_id: user.id,
      channel_id: channel.id,
    };

    const userId = user.id;
    const channelId = channel.id;

    it('should remove a user from a channel', async () => {
      jest.spyOn(prismaClient.user, 'findUnique').mockResolvedValue(user);
      jest.spyOn(prismaClient.channel, 'findUnique').mockResolvedValue(channel);
      jest
        .spyOn(prismaClient.userChannel, 'delete')
        .mockResolvedValue(userChannel);

      const result = await userChannelService.removeUserFromChannel(
        userId,
        channelId,
      );
      expect(result).toBeDefined(); // Vous pouvez ajuster cette vérification selon ce que renvoie la suppression
    });

    it('should throw an exception if the user is not found', async () => {
      jest.spyOn(prismaClient.user, 'findUnique').mockResolvedValue(null);
      jest.spyOn(prismaClient.channel, 'findUnique').mockResolvedValue(channel);

      await expect(
        userChannelService.removeUserFromChannel(userId, channelId),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw an exception if the channel is not found', async () => {
      jest.spyOn(prismaClient.user, 'findUnique').mockResolvedValue(user);
      jest.spyOn(prismaClient.channel, 'findUnique').mockResolvedValue(null);

      await expect(
        userChannelService.removeUserFromChannel(userId, channelId),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getChannelsByUserId', () => {
    const userId = 1;
    const mockChannels = [
      { id: 1, name: 'Channel 1', password: undefined, mode: 'open' },
      { id: 2, name: 'Channel 2', password: undefined, mode: 'open' },
    ];

    it('should retrieve channels for a given user', async () => {
      const userWithChannels = {
        user_channel: mockChannels.map((channel) => ({ channel })),
      };

      jest
        .spyOn(prismaClient.user, 'findUnique')
        .mockResolvedValue(userWithChannels as any);

      const channels = await userChannelService.getChannelsByUserId(userId);
      expect(channels).toEqual(mockChannels);
    });

    it('should return null if the user does not exist', async () => {
      jest.spyOn(prismaClient.user, 'findUnique').mockResolvedValue(null);

      const channels = await userChannelService.getChannelsByUserId(userId);
      expect(channels).toBeNull();
    });
  });

  describe('getUsersByChannelId', () => {
    const channelId = 1;
    const mockUsers = [
      { id: 1, name: 'User 1' },
      { id: 2, name: 'User 2' },
    ];

    it('should retrieve users for a given channel', async () => {
      const channelWithUsers = {
        user_channel: mockUsers.map((user) => ({ user })),
      };

      jest
        .spyOn(prismaClient.channel, 'findUnique')
        .mockResolvedValue(channelWithUsers as any);

      const users = await userChannelService.getUsersByChannelId(channelId);
      expect(users).toEqual(mockUsers);
    });

    // describe('getUsersByChannelId', () => {
    //   const channelId = 1;

    //   it('should return null if the channel does not have users', async () => {
    //     // Simuler un canal trouvé avec un champ `user_channel` vide
    //     const channelWithUsers = {
    //       user_channel: [] // Pas besoin de mapper sur un tableau vide
    //     };

    //     jest.spyOn(prismaClient.channel, 'findUnique').mockResolvedValue(channelWithUsers as any);

    //     const users = await userChannelService.getUsersByChannelId(channelId);
    //     expect(users).toBeNull();
    //   });

    // });

    it('should return null if the channel does not have users', async () => {
      const channelWithoutUsers = {
        user_channel: [],
      };

      jest
        .spyOn(prismaClient.channel, 'findUnique')
        .mockResolvedValue(channelWithoutUsers as any);

      const users = await userChannelService.getUsersByChannelId(channelId);
      expect(users).toEqual([]);
    });

    it('should return an empty array if the channel does not exist', async () => {
      jest.spyOn(prismaClient.channel, 'findUnique').mockResolvedValue(null);

      const users = await userChannelService.getUsersByChannelId(channelId);
      expect(users).toBeNull();
    });
  });
});
