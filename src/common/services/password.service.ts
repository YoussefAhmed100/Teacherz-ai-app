import { Injectable, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordService {
  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  async validate(currentPassword: string, hashedPassword: string): Promise<void> {
    const isCorrect = await bcrypt.compare(currentPassword, hashedPassword);
    if (!isCorrect) {
      throw new BadRequestException('Incorrect current password');
    }
  }

  ensureMatch(password: string, confirm: string): void {
    if (password !== confirm) {
      throw new BadRequestException('Password and confirm password must match');
    }
  }
}
