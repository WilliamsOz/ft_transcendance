import { MessageService } from '../service/service.message';
import { PrismaClient } from '@prisma/client';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('MessageService', () => {
  let messageService: MessageService;
  let prismaClient: PrismaClient;

  beforeEach(async () => {
    prismaClient = new PrismaClient();
    messageService = new MessageService(prismaClient);
  });

  it('should create a message', async () => {
    const userId = 1;
    const messageData = {
      id: 1, // Assurez-vous que c'est un identifiant valide pour vos tests
      content: 'Test message content',
      date: new Date(),
      sender_id: userId,
      discussion_id: undefined, // Champ optionnel, peut être nul
      channel_id: undefined, // Champ optionnel, peut être nul
      message_id: undefined, // Champ optionnel, peut être nul
    };
    const user = {
      id: 1,
      login42: 'test',
      email: 'momo@lol.fr',
      image_url: 'https://cdn.intra.42.fr/users/small_momo.jpg',
      name: 'momo',
      status: 'online',
      password: 'test',
      // autres propriétés d'utilisateur nécessaires pour les tests
    };

    jest.spyOn(prismaClient.user, 'findUnique').mockResolvedValue(user);
    jest
      .spyOn(prismaClient.message, 'create')
      .mockResolvedValue({ ...messageData, sender_id: user.id });

    const messageCreated = await messageService.create(messageData);

    expect(messageCreated).toEqual(messageData);
    expect(prismaClient.user.findUnique).toHaveBeenCalledWith({
      where: { id: userId },
    });
    expect(prismaClient.message.create).toHaveBeenCalledWith({
      data: {
        ...messageData,
        sender: {
          connect: { id: userId },
        },
      },
    });
  });

  it('should throw a BadRequestException when creating a message with content length > 1000', async () => {
    const userId = 1;
    const messageData = {
      id: userId,
      content: 'a'.repeat(1001), // Crée un contenu de message de plus de 1000 caractères
      date: new Date(),
      sender_id: userId,
      discussion_id: undefined, // Champ optionnel, peut être nul
      channel_id: undefined, // Champ optionnel, peut être nul
      message_id: undefined, // Champ optionnel, peut être nul
      login42: 'test',
      email: 'joa@lol.fr',
      image_url: 'https://cdn.intra.42.fr/users/small_joa.jpg',
      name: 'joa',
      status: 'online',
      password: 'test',
    };

    jest.spyOn(prismaClient.user, 'findUnique').mockResolvedValue(messageData);

    await expect(messageService.create(messageData)).rejects.toThrowError(
      BadRequestException,
    );
  });

  it('should throw a BadRequestException when creating a message with content length > 1000', async () => {
    const userId = 1;
    const longContent = 'a'.repeat(1001);
    const messageData = {
      userId,
      content: longContent,
    };
    const user = {
      id: userId,
      login42: 'test',
      email: 'joa@lol.fr',
      image_url: 'https://cdn.intra.42.fr/users/small_joa.jpg',
      name: 'joa',
      status: 'online',
      password: 'test',
      // autres propriétés d'utilisateur nécessaires pour les tests
    };

    jest.spyOn(prismaClient.user, 'findUnique').mockResolvedValue(user);

    await expect(messageService.create(messageData)).rejects.toThrowError(
      BadRequestException,
    );
  });

  it('should delete a message', async () => {
    const messageId = 1;
    const messageData = {
      id: messageId,
      content: 'test',
      date: new Date(),
      sender_id: 1,
      discussion_id: 1,
      channel_id: 1,
      message_id: 1,
      // autres propriétés du message nécessaires pour les tests
    };

    jest
      .spyOn(prismaClient.message, 'findUnique')
      .mockResolvedValue(messageData);
    jest.spyOn(prismaClient.message, 'delete').mockResolvedValue(messageData);

    const messageDeleted = await messageService.delete(messageId);

    expect(messageDeleted).toEqual(messageData);
    expect(prismaClient.message.findUnique).toHaveBeenCalledWith({
      where: { id: messageId },
    });
    expect(prismaClient.message.delete).toHaveBeenCalledWith({
      where: { id: messageId },
    });
  });

  it('should throw a NotFoundException when deleting a non-existing message', async () => {
    const nonExistingMessageId = 999;

    jest.spyOn(prismaClient.message, 'findUnique').mockResolvedValue(null);

    await expect(
      messageService.delete(nonExistingMessageId),
    ).rejects.toThrowError(NotFoundException);
  });

  it('should update a message', async () => {
    const number = 1;
    const updatedMessageData = {
      id: number,
      content: 'test',
      date: new Date(),
      sender_id: 1,
      discussion_id: 1,
      channel_id: 1,
      message_id: 1,
    };
    const messageData = {
      id: number,
      content: 'test',
      date: new Date(),
      sender_id: 1,
      discussion_id: 1,
      channel_id: 1,
      message_id: 1,
    };

    jest
      .spyOn(prismaClient.message, 'findUnique')
      .mockResolvedValue(messageData);
    jest
      .spyOn(prismaClient.message, 'update')
      .mockResolvedValue(updatedMessageData);

    const updatedMessage = await messageService.update(
      number,
      updatedMessageData,
    );

    expect(updatedMessage).toEqual(updatedMessageData);
    expect(prismaClient.message.findUnique).toHaveBeenCalledWith({
      where: { id: number },
    });
    expect(prismaClient.message.update).toHaveBeenCalledWith({
      where: { id: number },
      data: updatedMessageData,
    });
  });

  it('should throw a NotFoundException when updating a non-existing message', async () => {
    const nonExistingMessageId = 999;
    const updatedMessageData = {
      // Données de mise à jour du message
    };

    jest.spyOn(prismaClient.message, 'findUnique').mockResolvedValue(null);

    await expect(
      messageService.update(nonExistingMessageId, updatedMessageData),
    ).rejects.toThrowError(NotFoundException);
  });

  it('should find a message by ID', async () => {
    const number = 1;
    const messageData = {
      id: number,
      content: 'test',
      date: new Date(),
      sender_id: 1,
      discussion_id: 1,
      channel_id: 1,
      message_id: 1,
    };

    jest
      .spyOn(prismaClient.message, 'findUnique')
      .mockResolvedValue(messageData);

    const foundMessage = await messageService.findById(number);

    expect(foundMessage).toEqual(messageData);
    expect(prismaClient.message.findUnique).toHaveBeenCalledWith({
      where: { id: number },
    });
  });

  it('should throw a NotFoundException when finding a non-existing message by ID', async () => {
    const nonExistingMessageId = 999;

    jest.spyOn(prismaClient.message, 'findUnique').mockResolvedValue(null);

    await expect(
      messageService.findById(nonExistingMessageId),
    ).rejects.toThrowError(NotFoundException);
  });
});
