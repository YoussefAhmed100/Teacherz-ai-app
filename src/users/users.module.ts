import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UserService} from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { UserValidationService } from './validation/user-validation.service';
import { PasswordService } from 'src/common/services/password.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({}),
  ],
  controllers: [UsersController],
  providers: [UserService,UserValidationService,PasswordService],
})
export class UsersModule {}
