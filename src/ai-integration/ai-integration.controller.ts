/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Controller,
  Post,
  Body,
  Headers,
  Res,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import type { Response } from 'express';
import { AiIntegrationService } from './ai-integration.service';
import { ExplainPointDto } from './dto/explain-point.dto';
import { GenerateQuestionDto } from './dto/generate-question.dto';
import { EvaluateAnswerDto } from './dto/evaluate-answer.dto';

@ApiTags('AI Integration')
@ApiBearerAuth()
@Controller('ai')
export class AiIntegrationController {
  constructor(private readonly aiService: AiIntegrationService) {}

  @Post('explain')
  @ApiOperation({
    summary: 'شرح النقطة التعليمية',
    description: 'يرسل عنوان النقطة وأسلوب الشرح إلى نموذج الذكاء الاصطناعي ويعيد الشرح كلمة بكلمة (SSE).',
  })
  @ApiResponse({ status: 200, description: 'تم شرح النقطة بنجاح (SSE stream).' })
  async explainPoint(
    @Body() body: ExplainPointDto,

    @Res() res: Response,
  ) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const result = await this.aiService.explainPoint(
      body.point_title,
      body.teaching_style,
     
    );

    const words = result.explanation.split(' ');
    for (const word of words) {
      res.write(`data: ${word}\n\n`);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    res.write(`data: [DONE]\n\n`);
    res.end();
  }

  @Post('generate')
  @ApiOperation({
    summary: 'توليد سؤال حول نقطة تعليمية',
    description: 'يرسل عنوان النقطة للنموذج ويعيد سؤالاً مناسباً لها.',
  })
  @ApiResponse({ status: 200, description: 'تم توليد السؤال بنجاح.' })
  async generateQuestion(
    @Body() body: GenerateQuestionDto,
   
  ) {
    return this.aiService.generateQuestion(body.point_title);
  }

  @Post('evaluate-answer')
  @ApiOperation({
    summary: 'تقييم إجابة الطالب',
    description: 'يرسل إجابة الطالب على سؤال معين لتقييمها من النموذج.',
  })
  @ApiResponse({ status: 200, description: 'تم تقييم الإجابة بنجاح.' })
  async evaluateAnswer(
    @Body() body: EvaluateAnswerDto,
   
  ) {
    return this.aiService.evaluateAnswer(
      body.point_title,
      body.question_text,
      body.student_answer,
    );
  }
}
