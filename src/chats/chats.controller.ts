import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  UseGuards,
  Param,
  Delete,
} from '@nestjs/common';
import { ChatsService } from './chats.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { RequestDTO } from './dto/get-user-messages-dto';

@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Post()
  create(@Body() createChatDto: CreateChatDto) {
    return this.chatsService.create(createChatDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  getUserChats(@Request() req: RequestDTO) {
    return this.chatsService.getUserChats(req.user);
  }

  @Get(':id/messages')
  getChatMessages(@Param('id') id: string) {
    return this.chatsService.getChatMessages(id);
  }

  @Delete(':id')
  deleteChat(@Param('id') id: string) {
    return this.chatsService.deleteChat(id);
  }
}
