import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { User, UserDocument } from '../users/schema/user.schema';
import { SinupDto } from './dtos/sinup.dto';
import { LoginDto } from './dtos/login.dto';
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


}
