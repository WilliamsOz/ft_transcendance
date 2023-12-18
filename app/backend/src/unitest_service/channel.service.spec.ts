import { UserChannelService } from '../service/service.channel';
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

  it('should add a user to a channel', async () => {
    const userId = 1;
    const channelId = 2;
    const expectedUserChannel = {
      user_id: 1,
      channel_id: 2,
    };
    jest
      .spyOn(prismaClient.userChannel, 'create')
      .mockResolvedValue(expectedUserChannel);
    const userChannel = await userChannelService.addUserToChannel(
      userId,
      channelId,
    );
    expect(userChannel).toEqual(expectedUserChannel);
  });

  it('should remove a user from a channel', async () => {
    const userId = 1;
    const channelId = 2;
    const expectedUserChannel = {
      user_id: 1,
      channel_id: 2,
    };
    jest
      .spyOn(prismaClient.userChannel, 'delete')
      .mockResolvedValue(expectedUserChannel);
    const userChannel = await userChannelService.removeUserFromChannel(
      userId,
      channelId,
    );
    expect(userChannel).toEqual(expectedUserChannel);
  });
});
