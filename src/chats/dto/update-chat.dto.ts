import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export enum Sender {
  USER = 'user',
  ASSISTANT = 'assistant',
}

export class UpdateChatDto {
  @ApiProperty({
    example: 'f1cd4d95-b1a8-49ba-9187-262a9dbee382',
    description: 'ID del chat al que pertenece el mensaje',
  })
  @IsUUID()
  @IsNotEmpty()
  chat_id: string;

  @ApiProperty({
    example: '¿Puedes ayudarme con esto?',
    description: 'Contenido del mensaje',
  })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({
    example: 'user',
    description: 'Remitente del mensaje',
    enum: ['user', 'assistant'],
  })
  @IsNotEmpty()
  sender: Sender;
}
