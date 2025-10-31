import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { Sender } from './update-chat.dto';

export class CreateChatDto {
  @ApiProperty({
    example: 'Mi conversación con IA',
    description: 'Título del chat (opcional, se genera automáticamente con IA)',
    required: false,
  })
  @IsString()
  @IsOptional()
  title: string;

  @ApiProperty({
    example: 'f1cd4d95-b1a8-49ba-9187-262a9dbee382',
    description: 'ID del usuario que crea el chat',
  })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    example: '¿Cómo estás?',
    description: 'Primer mensaje del chat',
  })
  @IsNotEmpty()
  @IsString()
  message: string;

  @ApiProperty({
    example: 'user',
    description: 'Remitente del mensaje (user o bot)',
    enum: ['user', 'bot'],
  })
  @IsNotEmpty()
  sender: Sender;
}
