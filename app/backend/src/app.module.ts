import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaClient } from '@prisma/client';
import { ChannelsController } from './chat_part/chat/chat.controller';
import { UserChannelService } from './service/channel/channel.service';
@Module({
  imports: [],
  controllers: [AppController, ChannelsController],
  providers: [AppService, UserChannelService],
})
export class AppModule {}
