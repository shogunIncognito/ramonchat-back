import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Chat } from 'src/chats/entities/chat.entity';
import { OpenaiModule } from 'src/openai/openai.module';

@Module({
  imports: [TypeOrmModule.forFeature([Message, Chat]), OpenaiModule],
  controllers: [MessagesController],
  providers: [MessagesService],
  exports: [MessagesService],
})
export class MessagesModule {}
