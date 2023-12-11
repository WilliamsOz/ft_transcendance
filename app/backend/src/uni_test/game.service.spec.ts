import { GameService } from '../service/service.game';
import { PrismaClient } from '@prisma/client';

describe('GameService', () => {
    let gameService: GameService;
    let prismaClient: PrismaClient;

    beforeEach(async () => {
        prismaClient = new PrismaClient();
        gameService = new GameService(prismaClient);
    }
    );

    it ('should create a game', async () => {
        const game = {
            id: 1,
            user_id_1: 1,
            user_id_2: 2,
            type: 'en cours',
            winner_id: null,
        };
        // const game_2 = {
        //     id: 2,
        //     user_id_1: 1,
        //     user_id_2: 2,
        //     type: 'en cours',
        //     winner_id: null,
        // };
        jest.spyOn(prismaClient.game, 'create').mockResolvedValue(game);
        const gameCreated = await gameService.create(game);
        expect(gameCreated).toEqual(game);
    });

    it ('should delete a game', async () => {
        const game = {
            id: 1,
            user_id_1: 1,
            user_id_2: 2,
            type: 'en cours',
            winner_id: null,
        };
        jest.spyOn(prismaClient.game, 'delete').mockResolvedValue(game);
        const gameDeleted = await gameService.delete(1);
        expect(gameDeleted).toEqual(game);
    });

    it ('should update a game', async () => {
        const game = {
            id: 1,
            user_id_1: 1,
            user_id_2: 2,
            type: 'en cours',
            winner_id: null,
        };
        jest.spyOn(prismaClient.game, 'update').mockResolvedValue(game);
        const gameUpdated = await gameService.update(1, game);
        expect(gameUpdated).toEqual(game);
    });

    it ('should find a game by id', async () => {
        const game = {
            id: 1,
            user_id_1: 1,
            user_id_2: 2,
            type: 'en cours',
            winner_id: null,
        };
        jest.spyOn(prismaClient.game, 'findUnique').mockResolvedValue(game);
        const gameFound = await gameService.findbyId(1);
        expect(gameFound).toEqual(game);
    });

    it ('should find games by user id', async () => {
        const game = {
            id: 1,
            user_id_1: 1,
            user_id_2: 2,
            type: 'en cours',
            winner_id: null,
        };
        jest.spyOn(prismaClient.game, 'findMany').mockResolvedValue([game]);
        const gamesFound = await gameService.findGamesByUserId(1);
        expect(gamesFound).toEqual([game]);
    });

});
