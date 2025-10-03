import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
  @ApiProperty({
    description: 'User email for login',
    example: 'ahmed@example.com',
  })
  @IsEmail({}, { message: "Please enter a valid email" })
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({
    description: 'User password (min length 6)',
    example: 'Password@123',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  readonly password: string;
}
