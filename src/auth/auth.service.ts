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

      const payload = { sub: user.id, email: user.email };
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
    const payload = { sub: newUser.id, email: newUser.email };

    return this.jwtService.sign(payload);
  }
}
