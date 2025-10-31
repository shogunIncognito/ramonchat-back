import { Controller, UseGuards } from '@nestjs/common';
import { OpenaiService } from './openai.service';
import { AuthGuard } from 'src/guards/auth/auth.guard';

@Controller('openai')
@UseGuards(AuthGuard)
export class OpenaiController {
  constructor(private readonly openaiService: OpenaiService) {}
}
