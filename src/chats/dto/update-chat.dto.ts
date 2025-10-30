import { IsNotEmpty, IsString } from 'class-validator';

export enum Sender {
  USER = 'user',
  BOT = 'bot',
}

export class UpdateChatDto {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsNotEmpty()
  sender: Sender;
}
