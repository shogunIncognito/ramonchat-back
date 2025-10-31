import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from 'src/messages/entities/message.entity';
import { Chat } from './entities/chat.entity';
import { MessagesModule } from 'src/messages/messages.module';
import { OpenaiModule } from 'src/openai/openai.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message, Chat]),
    MessagesModule,
    OpenaiModule,
  ],
  controllers: [ChatsController],
  providers: [ChatsService],
})
export class ChatsModule {}
