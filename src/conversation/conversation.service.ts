// conversation.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Conversation } from './schema/conversation.schema';
import { GeminiService } from './gemini.service';

@Injectable()
export class ConversationService {
  constructor(
    @InjectModel(Conversation.name) private conversationModel: Model<Conversation>,
    private readonly geminiService: GeminiService,
  ) {}

  async handleConversation(question: string, lessonId?: string) {
    // Step 1: بعت السؤال لـ Gemini
    const answer = await this.geminiService.askGemini(question);

    // Step 2: خزن في MongoDB
    const conversation = new this.conversationModel({
      question,
      answer,
      lessonId,
    });
    await conversation.save();

    // Step 3: رجّع response للـ frontend
    return {
      question,
      answer,
      lessonId,
    };
  }
}
