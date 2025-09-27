import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  Matches,
  IsIn
} from 'class-validator';
import { Role } from '../enums/roles.enum';

export class SinupDto {
  @IsNotEmpty()
  @IsString()
  readonly username: string;
  @IsEmail({}, { message: 'Please enter the valid email' })
  @IsNotEmpty()
  readonly email: string;

  @IsNotEmpty()
  @MinLength(8)
  @Matches(/(?=.*[a-z])/, { message: 'password must contain lowercase' })
  @Matches(/(?=.*[A-Z])/, { message: 'password must contain uppercase' })
  @Matches(/(?=.*\d)/, { message: 'password must contain number' })
  @Matches(/(?=.*[!@#$%^&*])/, {
    message: 'password must contain special character',
  })
  readonly password: string;

  @IsOptional()
  @IsIn(Object.values(Role))
  @IsEnum(Role)
  readonly role: Role[];
}
