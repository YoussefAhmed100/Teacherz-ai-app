import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class EvaluateAnswerDto {
  @ApiProperty({
    example: 'سعة الاهتزازة',
    description: 'عنوان النقطة المتعلقة بالسؤال',
  })
  @IsString()
  @MinLength(2)
  point_title: string;

  @ApiProperty({
    example: 'اذكر تعريف سعة الاهتزازة ...',
    description: 'نص السؤال الذي سيتم تقييم الإجابة عليه',
  })
  @IsString()
  @MinLength(5)
  question_text: string;

  @ApiProperty({
    example: 'هي أقصى إزاحة ...',
    description: 'إجابة الطالب على السؤال',
  })
  @IsString()
  @MinLength(2)
  student_answer: string;
}
