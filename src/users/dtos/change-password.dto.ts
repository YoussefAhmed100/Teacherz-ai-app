import { IsNotEmpty, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Match } from '../../utils/decorators/match.decorator';

export class ChangePasswordDto {
  @ApiProperty({ example: 'OldPass@123', description: 'Current password' })
  @IsNotEmpty({ message: 'Current password is required' })
  currentPassword: string;

  @ApiProperty({ example: 'NewPass@123', description: 'New password' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/(?=.*[a-z])/, { message: 'Password must contain lowercase letter' })
  @Matches(/(?=.*[A-Z])/, { message: 'Password must contain uppercase letter' })
  @Matches(/(?=.*\d)/, { message: 'Password must contain number' })
  @Matches(/(?=.*[!@#$%^&*])/, { message: 'Password must contain special character' })
  password: string;

  @ApiProperty({ example: 'NewPass@123', description: 'Confirm new password' })
  @IsNotEmpty({ message: 'Confirm password is required' })
  @Match('password', { message: 'Confirm password must match password' })
  confirmPassword: string;
}
