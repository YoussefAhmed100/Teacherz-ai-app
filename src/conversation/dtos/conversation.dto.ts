import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class  ConversationDto {
  @ApiProperty({
    description: 'The student question',
    example: 'ما هو قانون نيوتن الأول؟',
  })
  
  @IsString()
  @IsNotEmpty({ message: ' Question is required' })
  question: string;

  @ApiProperty({
    description: 'User ID who asked the question',
    example: '652f1e5d9c1234567890abcd',
  })
  userId: string;

  @ApiPropertyOptional({
    description: 'Lesson ID (if the question belongs to a specific lesson)',
    example: '653f2e7a9c0987654321dcba',
  })
  lessonId?: string;
}
