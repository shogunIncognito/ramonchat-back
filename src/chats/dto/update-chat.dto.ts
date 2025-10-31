import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export enum Sender {
  USER = 'user',
  ASSISTANT = 'assistant',
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
