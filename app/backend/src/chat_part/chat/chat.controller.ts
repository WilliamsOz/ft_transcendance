import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { UserChannelService } from '../../service/channel/channel.service';
import { CreateChannelDto } from '../dto/create-channel.dto';

@Controller('/channels')
export class ChannelsController {
    private UserChannelService: UserChannelService;

    constructor(userChannelService: UserChannelService) {
        this.UserChannelService = userChannelService;
    }

    @Post()
    create(@Body() createChannelDto: CreateChannelDto) {
        try 
        {
            this.UserChannelService.create(createChannelDto);
            return { message: 'Création du channel réussie' }; // Statut 201 (Created) pour succès
        }
        catch (error) 
        {
            throw new HttpException('Échec de la création', HttpStatus.BAD_REQUEST);
        }
    }
}
 