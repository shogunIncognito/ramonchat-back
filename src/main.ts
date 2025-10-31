import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validación global
  app.useGlobalPipes(new ValidationPipe());

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('RamonChat API')
    .setDescription('API para chat con inteligencia artificial usando OpenAI')
    .setVersion('1.0')
    .addTag('auth', 'Autenticación y registro de usuarios')
    .addTag('users', 'Gestión de usuarios')
    .addTag('chats', 'Gestión de conversaciones')
    .addTag('messages', 'Gestión de mensajes')
    .addTag('openai', 'Integración con OpenAI')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Ingresa tu token JWT',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
  console.log(
    `🚀 Aplicación corriendo en: http://localhost:${process.env.PORT ?? 3000}`,
  );
  console.log(
    `📚 Documentación Swagger en: http://localhost:${process.env.PORT ?? 3000}/api/docs`,
  );
}
bootstrap();
