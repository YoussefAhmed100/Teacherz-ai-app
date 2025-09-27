import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConversationService } from './conversation.service';
import { ConversationController } from './conversation.controller';
import { GeminiService } from './gemini.service';
import { Conversation, ConversationSchema } from './schema/conversation.schema';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Conversation.name, schema: ConversationSchema },
    ]),
        HttpModule
  ],
  providers: [ConversationService, GeminiService],
  controllers: [ConversationController],
})
export class ConversationModule {}
