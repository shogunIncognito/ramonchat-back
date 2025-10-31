import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiResponse({
    status: 200,
    description: 'Login exitoso. Retorna token JWT y datos del usuario.',
  })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas.' })
  async login(@Body() credentials: LoginAuthDto) {
    return this.authService.login(credentials);
  }

  @Post('register')
  @ApiOperation({ summary: 'Registrar nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario registrado exitosamente.' })
  @ApiResponse({
    status: 400,
    description: 'Email ya registrado o datos inválidos.',
  })
  register(@Body() credentials: RegisterAuthDto) {
    return this.authService.register(credentials);
  }
}
