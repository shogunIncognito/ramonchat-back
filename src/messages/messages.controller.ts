import { Body, Controller, Post } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { UpdateChatDto } from 'src/chats/dto/update-chat.dto';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post('new-message')
  newMessage(@Body() updateChatDto: UpdateChatDto) {
    return this.messagesService.newMessage(updateChatDto);
  }
}
