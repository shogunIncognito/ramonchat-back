import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Repository } from 'typeorm';
import { Sender, UpdateChatDto } from 'src/chats/dto/update-chat.dto';
import { Chat } from 'src/chats/entities/chat.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messagesRepository: Repository<Message>,
    @InjectRepository(Chat)
    private readonly chatsRepository: Repository<Chat>,
  ) {}
  async newMessage(updateChatDto: UpdateChatDto) {
    const chat = await this.chatsRepository.findOne({
      where: { id: updateChatDto.chat_id },
    });

    if (!chat) {
      throw new BadRequestException('Chat no encontrado');
    }

    const userMessage = this.messagesRepository.create({
      message: updateChatDto.message,
      sender: updateChatDto.sender,
      chat: chat,
    });
    await this.messagesRepository.save(userMessage);

    const messageFromIA = 'esta es la respuesta de la ia';

    const iaMessage = this.messagesRepository.create({
      message: messageFromIA,
      sender: Sender.BOT,
      chat: chat,
    });
    await this.messagesRepository.save(iaMessage);

    return iaMessage;
  }

  async getMessagesByChatId(chatId: string) {
    try {
      return this.messagesRepository.find({
        where: { chat: { id: chatId } },
        order: { created_at: 'ASC' },
      });
    } catch (error: any) {
      console.log(error);
      throw new InternalServerErrorException(
        'Error al obtener mensajes del chat.',
      );
    }
  }
}
