import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { Sender } from './update-chat.dto';

export class CreateChatDto {
  @IsString()
  @IsOptional()
  title: string;

  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  @IsString()
  message: string;

  @IsNotEmpty()
  sender: Sender;
}
