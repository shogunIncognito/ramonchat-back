import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RegisterAuthDto {
  @ApiProperty({
    example: 'Juan Pérez',
    description: 'Nombre de usuario',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    example: 'usuario@example.com',
    description: 'Email del usuario',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'Contraseña del usuario (mínimo 6 caracteres)',
    minLength: 6,
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
