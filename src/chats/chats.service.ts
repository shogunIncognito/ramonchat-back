import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { Sender } from './dto/update-chat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { Repository } from 'typeorm';
import { MessagesService } from 'src/messages/messages.service';
import { OpenaiService } from 'src/openai/openai.service';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(Chat) private readonly chatsRepository: Repository<Chat>,
    private readonly messagesServices: MessagesService,
    private readonly openaiService: OpenaiService,
  ) {}

  async create(createChatDto: CreateChatDto) {
    try {
      const generatedTitle = await this.openaiService.generateChatTitle(
        createChatDto.message,
      );

      const newChat = this.chatsRepository.create({
        title: createChatDto.title || generatedTitle,
        user: { id: createChatDto.userId },
      });

      await this.chatsRepository.save(newChat);

      return this.messagesServices.newMessage({
        chat_id: newChat.id,
        message: createChatDto.message,
        sender: Sender.USER,
      });
    } catch (error: any) {
      console.log(error);
      throw new InternalServerErrorException('Error al crear chat.');
    }
  }

  async getUserChats(user: { id_user: string }) {
    try {
      const userMessages = await this.chatsRepository.find({
        where: { user: { id: user.id_user } },
      });

      return userMessages;
    } catch (error: any) {
      console.log(error);
      throw new InternalServerErrorException('Error al obtener chats.');
    }
  }

  async getChatMessages(id_chat: string) {
    try {
      const chat = await this.chatsRepository.findOne({
        where: { id: id_chat },
      });

      if (!chat) {
        throw new BadRequestException('Chat no encontrado');
      }

      const messages = await this.messagesServices.getMessagesByChatId(id_chat);

      return { chat, messages };
    } catch (error: any) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      console.log(error);
      throw new InternalServerErrorException(
        'Error al obtener mensajes del chat.',
      );
    }
  }

  async findOne(id: string) {
    return this.chatsRepository.findOne({ where: { id } });
  }

  async deleteChat(id: string) {
    try {
      const existChat = await this.chatsRepository.findOne({ where: { id } });

      if (!existChat) {
        throw new BadRequestException('Chat no existe.');
      }

      await this.chatsRepository.remove(existChat);
      return { message: 'Chat eliminado correctamente.', existChat };
    } catch (error: any) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.log(error);
      throw new InternalServerErrorException('Error al eliminar el chat.');
    }
  }
}
