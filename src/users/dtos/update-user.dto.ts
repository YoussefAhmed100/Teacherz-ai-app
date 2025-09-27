// import { PartialType } from '@nestjs/swagger';
// import { CreateUserDto } from './create-user.dto';

// export class UpdateUserDto extends PartialType(CreateUserDto) {}
import { IsString, IsEmail, IsOptional, IsEnum } from 'class-validator';
import { Role } from '../../auth/enums/roles.enum';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

 

  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
