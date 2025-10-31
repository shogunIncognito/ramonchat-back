import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { MessagesService } from './messages.service';
import { UpdateChatDto } from 'src/chats/dto/update-chat.dto';
import { AuthGuard } from 'src/guards/auth/auth.guard';

@ApiTags('messages')
@Controller('messages')
@UseGuards(AuthGuard)
@ApiBearerAuth('JWT-auth')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post('new-message')
  @ApiOperation({ summary: 'Enviar nuevo mensaje a un chat existente' })
  @ApiResponse({
    status: 201,
    description: 'Mensaje enviado y respuesta de IA generada.',
  })
  @ApiResponse({ status: 404, description: 'Chat no encontrado.' })
  newMessage(@Body() updateChatDto: UpdateChatDto) {
    return this.messagesService.newMessage(updateChatDto);
  }
}
