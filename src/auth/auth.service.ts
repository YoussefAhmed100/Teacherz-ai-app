import { Injectable, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';

import { User, UserDocument } from '../users/schema/user.schema';
import { SinupDto } from './dtos/sinup.dto';
import { LoginDto } from './dtos/login.dto';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { SendEmailService } from '../utils/send-email.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
    private readonly emailService: SendEmailService,
  ) {}

  async signup(signupDto: SinupDto) {
    const existing = await this.userModel.findOne({ email: signupDto.email });
    if (existing) throw new BadRequestException('Email already in use');

    const newUser = await this.userModel.create(signupDto);

    const token = this.jwtService.sign({ userId: newUser._id, role: newUser.role });

    return { data: newUser, token };
  }

  async login(loginDto: LoginDto) {
    const user = await this.userModel.findOne({ email: loginDto.email });
    if (!user|| !await bcrypt.compare(loginDto.password, user.password) ) throw new UnauthorizedException('Invalid credentials');

    const token = this.jwtService.sign({ userId: user._id, role: user.role });

    return { data: user, token };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.userModel.findOne({ email: dto.email });
    if (!user) throw new NotFoundException('No user with this email');

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedResetCode = crypto.createHash('sha256').update(resetCode).digest('hex');

    user.passwordResetCode = hashedResetCode;
    user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
    user.passwordResetVerfid = false;

    await user.save();

    await this.emailService.sendEmail({
      to: user.email,
      subject: 'Reset Password',
      message: `Hi ${user.username},\nYour reset code is: ${resetCode}\nValid for 10 minutes.`,
    });

    return { message: `Password reset code sent to ${user.email}` };
  }
}
