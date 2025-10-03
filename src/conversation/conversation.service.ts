
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Conversation } from './schema/conversation.schema';
import { ConversationDto } from './dtos/conversation.dto';
import { GeminiProvider } from 'src/providers/gemini.provider';
@Injectable()
export class ConversationService {
  constructor(
    @InjectModel(Conversation.name) private conversationModel: Model<Conversation>,
    private  readonly geminiProvider: GeminiProvider,
  ) {}

  async handleConversation(dtos:ConversationDto) {
    const{question, lessonId}=dtos
    const answer = await this.geminiProvider.generateAnswer(question);

    const conversation = new this.conversationModel({
      question,
      answer,
      lessonId,
    });
    await conversation.save();

    return {
      question,
      answer,
      lessonId
     
    };
  }
}

