import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources';

@Injectable()
export class OpenaiService {
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  async processChat(
    message: string,
    allMessages: ChatCompletionMessageParam[],
  ) {
    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content:
            'Eres un asistente útil y amigable. el usuario puede hacerte preguntas sobre cualquier tema. o pedirte que realices tareas y todo lo harás de la mejor manera posible. No le falles al usuario. Si te pide algo ayudalo lo maximo posible.',
        },
        ...allMessages,
        { role: 'user', content: message },
      ],
      max_tokens: 150,
    });
    return completion.choices[0].message.content?.trim() || '';
  }

  async generateChatTitle(firstMessage: string): Promise<string> {
    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'Genera un título corto (máximo 6 palabras) para una conversación que comienza con el siguiente mensaje. Solo responde con el título, sin comillas ni puntos.',
        },
        {
          role: 'user',
          content: firstMessage,
        },
      ],
      max_tokens: 20,
    });

    return (
      completion.choices[0].message.content?.trim() || 'Nueva conversación'
    );
  }
}
