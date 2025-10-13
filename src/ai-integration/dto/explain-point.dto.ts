import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ExplainPointDto {
  @ApiProperty({
    example: 'الحركة التوافقية البسيطة',
    description: 'عنوان النقطة أو الدرس الذي سيتم شرحه',
  })
  @IsString()
  @MinLength(2)
  point_title: string;

  @ApiProperty({
    example: 'تفصيلي',
    description: 'أسلوب الشرح (تفصيلي / مبسط / متوسط)',
  })
  @IsString()
  teaching_style: string;
}
