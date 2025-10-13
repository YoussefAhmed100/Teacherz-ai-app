import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class GenerateQuestionDto {
  @ApiProperty({
    example: 'سعة الاهتزازة',
    description: 'عنوان النقطة التي سيتم توليد سؤال عنها',
  })
  @IsString()
  @MinLength(2)
  point_title: string;
}
