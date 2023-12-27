import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { UserChannelService } from '../../service/channel/channel.service';
import { CreateChannelDto } from '../dto/create-channel.dto';

@Controller('/channels')
export class ChannelsController {
  private UserChannelService: UserChannelService;

  constructor(userChannelService: UserChannelService) {
    this.UserChannelService = userChannelService;
  }

  @Post()
  async create(@Body() createChannelDto: CreateChannelDto): Promise<any> {
    try {
      await this.UserChannelService.create(createChannelDto);
      return { message: 'Création du channel réussie' };
    } catch (error) {
      // Il peut être utile de logger l'erreur pour un débogage plus facile
      console.error('Erreur lors de la création du channel :', error);

      // Lancer une exception HTTP avec un message d'erreur plus détaillé
      throw new HttpException(
        `Échec de la création: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
