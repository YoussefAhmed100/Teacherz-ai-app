import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class SendEmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST || 'smtp.gmail.com',
      port: Number(process.env.MAIL_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  async sendEmail({
    to,
    subject,
    message,
  }: {
    to: string;
    subject: string;
    message: string;
  }): Promise<void> {
    await this.transporter.sendMail({
      from: `"Aflam app" <${process.env.MAIL_FROM || process.env.MAIL_USER}>`,
      to,
      subject,
      text: message,
    });
  }
}
