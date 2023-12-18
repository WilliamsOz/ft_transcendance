import { Controller, Body, Post } from '@nestjs/common';
import { UserChannelService } from '../service/service.channel';

@Controller('channel') // Spécifiez ici le chemin de base pour le contrôleur
export class Channel_Controller {
  constructor(private userChannelService: UserChannelService) {}

  @Post()
  async createChannel(
    @Body() body: { user_id: number; channel_id: number },
  ): Promise<{ user_id: number; channel_id: number } | null> {}
}
