/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { User } from 'src/users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { ConfigService } from '@nestjs/config';
import { IncomingMessage } from 'http';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(
    credentials: LoginAuthDto,
  ): Promise<{ accessToken: string; user: User }> {
    try {
      const user = await this.usersService.findOneByEmail(credentials.email);

      const isPasswordCorrect = user
        ? await bcrypt.compare(credentials.password, user.password)
        : false;

      if (!user || !isPasswordCorrect) {
        throw new UnauthorizedException('Credenciales inválidas');
      }

      const payload = {
        id_user: user.id,
        email: user.email,
        username: user.username,
      };
      const accessToken = this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      return { accessToken, user };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      console.error('Error inesperado en el login:', error);
      throw new InternalServerErrorException(
        'Ocurrió un error inesperado en el servidor.',
      );
    }
  }

  async register(credentials: RegisterAuthDto) {
    const newUser = await this.usersService.create(credentials);
    const payload = {
      id_user: newUser.id,
      email: newUser.email,
      username: newUser.username,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });

    return { accessToken, user: newUser };
  }

  async validateToken(request: IncomingMessage) {
    try {
      const token = request.headers.authorization?.split(' ')[1];

      if (!token) {
        throw new UnauthorizedException('Token no proporcionado');
      }

      const user = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      return { valid: true, user };
    } catch (error: any) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      console.log(error);
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
}
