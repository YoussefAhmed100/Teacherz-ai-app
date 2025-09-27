// conversation.controller.ts
import { Controller, Body, Sse, Query } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { Observable, interval} from 'rxjs';

@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  // @Post('ask')
  // async askQuestion(@Body('question') question: string, @Body('lessonId') lessonId?: string) {
  //   return this.conversationService.handleConversation(question, lessonId);
  // }
 

@Sse('ask')
async askQuestion(
  @Body('question') question: string,
  @Query('mode') mode: 'word' | 'chunk' = 'chunk',
): Promise<Observable<{ data: string }>> {
  const result = await this.conversationService.handleConversation(question);
  const answer = result.answer;

  if (mode === 'word') {
    const words = answer.split(' ');

    return new Observable<{ data: string }>((subscriber) => {
      let index = 0;
      const source$ = interval(200).subscribe(() => {
        if (index < words.length) {
          subscriber.next({ data: words[index] });
          index++;
        } else {
          subscriber.next({ data: '[DONE]' });
          subscriber.complete();
        }
      });

      return () => source$.unsubscribe();
    });
  }

  const chunks = answer.split(/(?<=[.?!])\s+/);

  return new Observable<{ data: string }>((subscriber) => {
    let index = 0;
    const source$ = interval(1000).subscribe(() => {
      if (index < chunks.length) {
        subscriber.next({ data: chunks[index] });
        index++;
      } else {
        subscriber.next({ data: '[DONE]' });
        subscriber.complete();
      }
    });

    return () => source$.unsubscribe();
  });
}
}
