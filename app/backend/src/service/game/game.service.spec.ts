import { GameService } from './game.service';
import { PrismaClient } from '@prisma/client';

describe('GameService', () => {
  let gameService: GameService;
  let prismaClient: PrismaClient;

  beforeEach(() => {
    prismaClient = new PrismaClient();
    gameService = new GameService(prismaClient);
  });

  it('should throw NotFoundException when create is called with non-existing user id', async () => {
    const userId = 999; // Utilisez un ID qui n'existe pas dans la base de données de test
    const gameData = {};

    prismaClient.user.findUnique = jest.fn().mockResolvedValue(null);

    const createGame = async () => {
      await gameService.create(userId, gameData);
    };

    await expect(createGame).rejects.toThrow('User id not found');

    // Vérifiez que la méthode findUnique a été appelée avec les bons paramètres
    expect(prismaClient.user.findUnique).toHaveBeenCalledWith({
      where: { id: userId },
    });
  });

  it('should throw NotFoundException when delete is called with non-existing game id', async () => {
    const gameId = 999; // Utilisez un ID qui n'existe pas dans la base de données de test

    // Configurez la méthode findUnique de prismaClient pour renvoyer null lorsque l'ID du jeu n'existe pas
    prismaClient.game.findUnique = jest.fn().mockResolvedValue(null);

    // Utilisez une fonction fléchée pour appeler delete avec les arguments attendus
    const deleteGame = async () => {
      await gameService.delete(gameId);
    };

    // Assurez-vous que deleteGame lève une NotFoundException
    await expect(deleteGame).rejects.toThrow('Game id not found');

    // Vérifiez que la méthode findUnique a été appelée avec les bons paramètres
    expect(prismaClient.game.findUnique).toHaveBeenCalledWith({
      where: { id: gameId },
    });
  });

  it('should throw NotFoundException when update is called with non-existing game id', async () => {
    const gameId = 999; // Utilisez un ID qui n'existe pas dans la base de données de test
    const gameData = {
      id: gameId,
      user_id_1: 1,
      user_id_2: 2,
      type: 'en cours',
      winner_id: 2,
    };

    // Configurez la méthode findUnique de prismaClient pour renvoyer null lorsque l'ID du jeu n'existe pas
    prismaClient.game.findUnique = jest.fn().mockResolvedValue(null);

    // Utilisez une fonction fléchée pour appeler update avec les arguments attendus
    const updateGame = async () => {
      await gameService.update(gameId, gameData);
    };

    // Assurez-vous que updateGame lève une NotFoundException
    await expect(updateGame).rejects.toThrow('Game id not found');

    // Vérifiez que la méthode findUnique a été appelée avec les bons paramètres
    expect(prismaClient.game.findUnique).toHaveBeenCalledWith({
      where: { id: gameId },
    });
  });

  it('should throw NotFoundException when findbyId is called with non-existing game id', async () => {
    const gameId = 999; // Utilisez un ID qui n'existe pas dans la base de données de test

    prismaClient.game.findUnique = jest.fn().mockResolvedValue(null);

    const findGameById = async () => {
      await gameService.findbyId(gameId);
    };

    await expect(findGameById).rejects.toThrow('Game id not found');

    expect(prismaClient.game.findUnique).toHaveBeenCalledWith({
      where: { id: gameId },
    });
  });

  it('should throw NotFoundException when findGamesByUserId is called with non-existing user id', async () => {
    const userId = 999; // Utilisez un ID qui n'existe pas dans la base de données de test

    prismaClient.user.findUnique = jest.fn().mockResolvedValue(null);

    const findGamesByUser = async () => {
      await gameService.findGamesByUserId(userId);
    };

    await expect(findGamesByUser).rejects.toThrow('User not found');

    expect(prismaClient.user.findUnique).toHaveBeenCalledWith({
      where: { id: userId },
    });
  });
  it('should create a game', async () => {
    const gameId = 1;
    const gameData = {
      id: gameId,
      user_id_1: gameId,
      user_id_2: 2,
      type: 'en cours',
      winner_id: 2,
    };

    // Configurez la méthode findUnique de prismaClient pour renvoyer un utilisateur existant
    prismaClient.user.findUnique = jest.fn().mockResolvedValue({ id: 1 });

    // Configurez la méthode create de prismaClient pour renvoyer le jeu créé
    prismaClient.game.create = jest.fn().mockResolvedValue(gameData);

    const gameCreated = await gameService.create(gameId, gameData);

    expect(gameCreated).toEqual(gameData);

    // Vérifiez que la méthode findUnique a été appelée avec les bons paramètres
    expect(prismaClient.user.findUnique).toHaveBeenCalledWith({
      where: { id: gameId },
    });

    // Vérifiez que la méthode create a été appelée avec les bons paramètres
    expect(prismaClient.game.create).toHaveBeenCalledWith({
      data: gameData,
    });
  });

  it('should find games by user id', async () => {
    const userId = 1;
    const gameId = 1;
    const game = {
      id: gameId,
      user_id_1: userId,
      user_id_2: 2,
      type: 'en cours',
      winner_id: 2,
    };

    // Configurez la méthode findUnique de prismaClient pour renvoyer un utilisateur existant
    prismaClient.user.findUnique = jest.fn().mockResolvedValue({ id: userId });

    // Configurez la méthode findMany de prismaClient pour renvoyer les jeux de l'utilisateur
    prismaClient.game.findMany = jest.fn().mockResolvedValue([game]);

    const gamesFound = await gameService.findGamesByUserId(userId);

    expect(gamesFound).toEqual([game]);

    // Vérifiez que la méthode findUnique a été appelée avec les bons paramètres
    expect(prismaClient.user.findUnique).toHaveBeenCalledWith({
      where: { id: userId },
    });

    // Vérifiez que la méthode findMany a été appelée avec les bons paramètres
    expect(prismaClient.game.findMany).toHaveBeenCalledWith({
      where: {
        OR: [{ user_id_1: userId }, { user_id_2: userId }],
      },
    });
  });
});
