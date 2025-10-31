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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { ChatsService } from './chats.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { RequestDTO } from './dto/get-user-messages-dto';

@ApiTags('chats')
@Controller('chats')
@UseGuards(AuthGuard)
@ApiBearerAuth('JWT-auth')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nuevo chat' })
  @ApiResponse({
    status: 201,
    description:
      'Chat creado exitosamente con el primer mensaje y respuesta de IA.',
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  create(@Body() createChatDto: CreateChatDto) {
    return this.chatsService.create(createChatDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los chats del usuario autenticado' })
  @ApiResponse({ status: 200, description: 'Lista de chats del usuario.' })
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  getUserChats(@Request() req: RequestDTO) {
    return this.chatsService.getUserChats(req.user);
  }

  @Get(':id/messages')
  @ApiOperation({ summary: 'Obtener mensajes de un chat específico' })
  @ApiParam({
    name: 'id',
    description: 'ID del chat',
    example: 'f1cd4d95-b1a8-49ba-9187-262a9dbee382',
  })
  @ApiResponse({ status: 200, description: 'Chat con todos sus mensajes.' })
  @ApiResponse({ status: 404, description: 'Chat no encontrado.' })
  getChatMessages(@Param('id') id: string) {
    return this.chatsService.getChatMessages(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un chat' })
  @ApiParam({
    name: 'id',
    description: 'ID del chat a eliminar',
    example: 'f1cd4d95-b1a8-49ba-9187-262a9dbee382',
  })
  @ApiResponse({
    status: 200,
    description: 'Chat eliminado exitosamente (elimina mensajes en cascada).',
  })
  @ApiResponse({ status: 404, description: 'Chat no encontrado.' })
  deleteChat(@Param('id') id: string) {
    return this.chatsService.deleteChat(id);
  }
}
