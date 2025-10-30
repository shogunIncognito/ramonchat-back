import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { Sender, UpdateChatDto } from './dto/update-chat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { Repository } from 'typeorm';
import { Message } from 'src/messages/entities/message.entity';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(Chat) private readonly chatsRepository: Repository<Chat>,
    @InjectRepository(Message)
    private readonly messagesRepository: Repository<Message>,
  ) {}

  async create(createChatDto: CreateChatDto) {
    const generatedTitle = 'titulo generado por ia';

    const newChat = this.chatsRepository.create({
      title: createChatDto.title || generatedTitle,
      user: { id: createChatDto.userId },
    });

    await this.chatsRepository.save(newChat);

    // const userMessage = this.messagesRepository.create({
    //   message: createChatDto.message,
    //   sender: Sender.USER,
    //   chat: newChat,
    // });
    // await this.messagesRepository.save(userMessage);

    // const messageFromIA = 'esta es la respuesta de la ia desde create';

    // const iaMessage = this.messagesRepository.create({
    //   message: messageFromIA,
    //   sender: Sender.BOT,
    //   chat: newChat,
    // });
    // await this.messagesRepository.save(iaMessage);

    return this.newMessage(newChat.id, {
      message: createChatDto.message,
      sender: Sender.USER,
    });
  }

  async newMessage(id: string, updateChatDto: UpdateChatDto) {
    const chat = await this.chatsRepository.findOne({ where: { id } });

    if (!chat) {
      throw new BadRequestException('Chat no encontrado');
    }

    // Guardar el mensaje del usuario
    const userMessage = this.messagesRepository.create({
      message: updateChatDto.message,
      sender: updateChatDto.sender,
      chat: chat, // Pasamos toda la entidad chat
    });
    await this.messagesRepository.save(userMessage);

    // Procesar el mensaje con IA
    const messageFromIA = 'esta es la respuesta de la ia';

    // Guardar la respuesta de la IA
    const iaMessage = this.messagesRepository.create({
      message: messageFromIA,
      sender: Sender.BOT,
      chat: chat, // Pasamos toda la entidad chat
    });
    await this.messagesRepository.save(iaMessage);

    return iaMessage;
  }

  findAll() {
    return `This action returns all chats`;
  }

  findOne(id: string) {
    return this.chatsRepository.findOne({ where: { id } });
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }
}
