import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export enum Sender {
  USER = 'user',
  BOT = 'bot',
}

export class UpdateChatDto {
  @IsUUID()
  @IsNotEmpty()
  chat_id: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsNotEmpty()
  sender: Sender;
}
