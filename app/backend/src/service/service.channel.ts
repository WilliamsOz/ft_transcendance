import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient, UserChannel, Channel, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserChannelService 
{
	constructor(private readonly prisma: PrismaClient) {}
	async create(data: any): Promise<UserChannel | null> 
	{
		const user = await this.prisma.user.findUnique({
			where: { id: data.user_id },
		});
		if (!user) {
			throw new NotFoundException('User id not found'); // ou throw new NotFoundException('User not found');
		}
		const channel = await this.prisma.channel.findUnique({
			where: { id: data.channel_id },
		});
		if (!channel) {
			throw new NotFoundException('Channel id not found'); // ou throw new NotFoundException('User not found');
		}
		const saltRounds = 10;
		const hashedPassword = await bcrypt.hash(data.password, saltRounds);
		data.password = hashedPassword;
		return await this.prisma.userChannel.create({
			data,
		});
	}

	async addUserToChannel(
		userId: number,
		channelId: number,
	): Promise<UserChannel | null> {
		const user = await this.prisma.user.findUnique({
			where: { id: userId },
		});
		if (!user) {
			throw new NotFoundException('User id not found'); // ou throw new NotFoundException('User not found');
		}
		const channel = await this.prisma.channel.findUnique({
			where: { id: channelId },
		});
		if (!channel) {
			throw new NotFoundException('Channel id not found'); // ou throw new NotFoundException('User not found');
		}

		return await this.prisma.userChannel.create({
			data: {
				user_id: userId,
				channel_id: channelId,
			},
		});
	}
	async removeUserFromChannel(
		userId: number,
		channelId: number,
	): Promise<UserChannel | null> {
		// Supprimer un utilisateur d'un channel
		const user = await this.prisma.user.findUnique({
			where: { id: userId },
		});
		if (!user) {
			throw new NotFoundException('User id not found'); // ou throw new NotFoundException('User not found');
		}
		const channel = await this.prisma.channel.findUnique({
			where: { id: channelId },
		});
		if (!channel) {
			throw new NotFoundException('Channel id not found'); // ou throw new NotFoundException('User not found');
		}
		return await this.prisma.userChannel.delete({
			where: {
				user_id_channel_id: {
					// Utilisez les noms de champs réels
					user_id: userId,
					channel_id: channelId,
				},
			},
		});
	}

	async getChannelsByUserId(userId: number): Promise<Channel[] | null> {
		// recupere tout les channels d'un user
		const userWithChannels = await this.prisma.user.findUnique({
			where: { id: userId },
			include: {
				user_channel: {
					include: {
						channel: true,
					},
				},
			},
		});

		if (userWithChannels) {
			// il peut eter nul si l'utilisateur n'existe pas
			return userWithChannels.user_channel.map((uc) => uc.channel);
		}
		return null;
	}

	async getUsersByChannelId(channelId: number): Promise<User[] | null> {
		// recupere tout les users d'un channel
		const channelWithUsers = await this.prisma.channel.findUnique({
			where: { id: channelId },
			include: {
				user_channel: {
					include: {
						user: true,
					},
				},
			},
		});

		// Vérifier si le canal a été trouvé et a des utilisateurs associés
		if (channelWithUsers && channelWithUsers.user_channel)
			return channelWithUsers.user_channel.map((uc) => uc.user);
		// transformer le résultat en un tableau d'utilisateurs
		else return [];
		// Retourner un tableau vide si aucun utilisateur n'est trouvé
	}
}
