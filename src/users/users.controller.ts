import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/register-user.dto';
import { AuthGuard } from 'src/guards/auth/auth.guard';

@ApiTags('users')
@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente.' })
  @ApiResponse({
    status: 400,
    description: 'Email ya registrado o datos inválidos.',
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Obtener todos los usuarios (requiere autenticación)',
  })
  @ApiResponse({ status: 200, description: 'Lista de usuarios.' })
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener usuario por ID' })
  @ApiParam({ name: 'id', description: 'ID del usuario', example: '1' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Get('email')
  @ApiOperation({ summary: 'Buscar usuario por email' })
  @ApiQuery({
    name: 'email',
    description: 'Email del usuario',
    example: 'usuario@example.com',
  })
  @ApiResponse({ status: 200, description: 'Usuario encontrado.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  findOneByEmail(@Query('email') email: string) {
    return this.usersService.findOneByEmail(email);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar usuario' })
  @ApiParam({
    name: 'id',
    description: 'ID del usuario a eliminar',
    example: '1',
  })
  @ApiResponse({ status: 200, description: 'Usuario eliminado.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
