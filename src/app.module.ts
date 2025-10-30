import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { ChatsModule } from './chats/chats.module';
import { MessagesModule } from './messages/messages.module';
import { User } from './users/entities/user.entity';
import { Message } from './messages/entities/message.entity';
import { Chat } from './chats/entities/chat.entity';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, Message, Chat],
      synchronize: true, // Solo para desarrollo, desactiva en producción
    }),
    UsersModule,
    ChatsModule,
    MessagesModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
