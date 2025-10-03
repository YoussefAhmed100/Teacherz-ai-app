import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '../enums/roles.enum';

export class SinupDto {
  @ApiProperty({
    description: 'Username of the new user',
    example: 'ahmed123',
  })
  @IsNotEmpty()
  @IsString()
  readonly username: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'ahmed@example.com',
  })
  @IsEmail({}, { message: 'Please enter a valid email' })
  @IsNotEmpty()
  @Matches(/^[\w.+-]+@gmail\.com$/, {
    message: 'Email must be a valid Gmail address (example@gmail.com)',
  })
  readonly email: string;

  @ApiProperty({
    description:
      'Password must contain uppercase, lowercase, number, special character',
    example: 'Password@123',
    minLength: 8,
  })
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/(?=.*[a-z])/, { message: 'password must contain lowercase' })
  @Matches(/(?=.*[A-Z])/, { message: 'password must contain uppercase' })
  @Matches(/(?=.*\d)/, { message: 'password must contain number' })
  @Matches(/(?=.*[!@#$%^&*])/, {
    message: 'password must contain special character',
  })
  readonly password: string;

  @ApiPropertyOptional({
    description: 'Role of the user',
    enum: Role,
    example: Role.STUDENT,
  })
  @IsOptional()
  @IsEnum(Role)
  readonly role?: Role;
}
