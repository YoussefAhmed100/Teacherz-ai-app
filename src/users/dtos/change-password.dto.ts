import { IsNotEmpty, MinLength, Matches } from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty()
  currentPassword: string;

  @IsNotEmpty()
  @MinLength(8)
  @Matches(/(?=.*[a-z])/, { message: 'Password must contain lowercase letter' })
  @Matches(/(?=.*[A-Z])/, { message: 'Password must contain uppercase letter' })
  @Matches(/(?=.*\d)/, { message: 'Password must contain number' })
  @Matches(/(?=.*[!@#$%^&*])/, { message: 'Password must contain special character' })
  password: string;

  @IsNotEmpty()
  confirmPassword: string;
}
