import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConversationService } from './conversation.service';
import { ConversationController } from './conversation.controller';
import { Conversation, ConversationSchema } from './schema/conversation.schema';
import { HttpModule } from '@nestjs/axios';
import { GeminiProvider } from 'src/providers/gemini.provider';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Conversation.name, schema: ConversationSchema },
    ]),
        HttpModule
  ],
  providers: [ConversationService, GeminiProvider],
  controllers: [ConversationController],
})
export class ConversationModule {}
