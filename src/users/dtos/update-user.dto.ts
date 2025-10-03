import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'New username of the user',
    example: 'ahmed_updated',
  })
  @IsOptional()
  @IsString({ message: 'Username must be a string' })
  username?: string;


 


}
