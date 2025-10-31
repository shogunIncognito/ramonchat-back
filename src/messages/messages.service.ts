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
import { OpenaiService } from 'src/openai/openai.service';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messagesRepository: Repository<Message>,
    @InjectRepository(Chat)
    private readonly chatsRepository: Repository<Chat>,
    private readonly openaiService: OpenaiService,
  ) {}
  async newMessage(updateChatDto: UpdateChatDto) {
    const [chat, messages] = await Promise.all([
      this.chatsRepository.findOne({
        where: { id: updateChatDto.chat_id },
      }),
      this.messagesRepository.find({
        where: { chat: { id: updateChatDto.chat_id } },
        order: { created_at: 'ASC' },
      }),
    ]);

    if (!chat) {
      throw new BadRequestException('Chat no encontrado');
    }

    const userMessage = this.messagesRepository.create({
      message: updateChatDto.message,
      sender: updateChatDto.sender,
      chat: chat,
    });
    void this.messagesRepository.save(userMessage); // se guarda sin await para optimizar tiempo

    const messageFromIA = await this.openaiService.processChat(
      updateChatDto.message,
      [...messages, userMessage].map((msg) => ({
        content: msg.message,
        role: msg.sender,
      })),
    );

    const iaMessage = this.messagesRepository.create({
      message: messageFromIA,
      sender: Sender.ASSISTANT,
      chat: chat,
    });
    void this.messagesRepository.save(iaMessage);

    return { message: messageFromIA, role: 'assistant', id_chat: chat.id };
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
