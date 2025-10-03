/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Controller,
  Post,
  Body,

  Query,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';

import { ConversationService } from './conversation.service';
import { ConversationDto } from './dtos/conversation.dto';
import { ApiBody, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Conversation')
@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post('ask')
  @ApiBody({ type: ConversationDto })
  @ApiQuery({
    name: 'mode',
    enum: ['word', 'chunk'],
    required: false,
    description: 'Streaming mode: send response word by word or chunk by chunk',
  })
  @ApiResponse({
    status: 200,
    description: 'Streamed response (SSE)',
    content: {
      'text/event-stream': {
        example: [
          { data: 'قانون' },
          { data: 'نيوتن' },
          { data: 'الأول' },
          { data: '[DONE]' },
        ],
      },
    },
  })
  async askQuestion(
    @Body() body: ConversationDto,
    @Query('mode') mode: 'word' | 'chunk' = 'chunk',
    @Res() res: Response,
  ) {
  

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const result = await this.conversationService.handleConversation(body);
    const answer = result.answer.trim();

    if (mode === 'word') {
      const words = answer
        .split(/\s+/)
        .map((w) => w.trim())
        .filter((w) => w.length > 0);

      let index = 0;
      const intervalId = setInterval(() => {
        if (index < words.length) {
          res.write(`data: ${words[index++]}\n\n`);
        } else {
          res.write(`data: [DONE]\n\n`);
          res.end();
          clearInterval(intervalId);
        }
      }, 200);
    } else {
      const chunks = answer
        .split(/(?<=[.?!])\s+/)
        .map((c) => c.trim())
        .filter((c) => c.length > 0);

      let index = 0;
      const intervalId = setInterval(() => {
        if (index < chunks.length) {
          res.write(`data: ${chunks[index++]}\n\n`);
        } else {
          res.write(`data: [DONE]\n\n`);
          res.end();
          clearInterval(intervalId);
        }
      }, 1000);
    }
  }
}
