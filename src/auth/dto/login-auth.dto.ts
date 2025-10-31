import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginAuthDto {
  @ApiProperty({
    example: 'usuario@example.com',
    description: 'Email del usuario',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'Contraseña del usuario',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
