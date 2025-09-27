import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { Role } from 'src/auth/enums/roles.enum';

@Schema({ timestamps: true })
export class User {
  @Prop({ unique: true, required: true, index: true })
  email: string;

  @Prop({ unique: true, required: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  avatar?: string;

 

  @Prop({ default: true })
  isActive: boolean;

  @Prop({
    type: {
      favoriteGenres: [{ type: String }],
      language: { type: String, default: 'en' },
    },
    default: {},
  })
  preferences: {
    favoriteGenres: string[];
    language: string;
  };

  @Prop()
  resetPasswordToken?: string;

  @Prop()
  resetPasswordExpires?: Date;

  @Prop({
    type: [{ type: String, enum: Role}],
    default: [Role.User],
   
  })
  role: Role[];
  @Prop()
  passwordResetCode?: string;

  @Prop()
  passwordResetExpires?: Date;

  @Prop({ default: false })
  passwordResetVerfid?: boolean;
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre<UserDocument>('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});
