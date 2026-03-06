import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  constructor(private config: ConfigService) {}
  async sendOtp(email: string, otp: string) {
    const transporter = nodemailer.createTransport({
      host: this.config.get('MAIL_HOST'),
      port: this.config.get('MAIL_PORT'),
      auth: {
        user: this.config.get('MAIL_USER'),
        pass: this.config.get('MAIL_PASS'),
      },
    });
    await transporter.sendMail({
      from: this.config.get('MAIL_FROM'),
      to: email,
      subject: 'OTP Verification',
      html: `<h2>Your OTP is ${otp}</h2>`,
    });
  }

  async sendPasswordResetLink(email: string, resetLink: string) {
    const transporter = nodemailer.createTransport({
      host: this.config.get('MAIL_HOST'),
      port: this.config.get('MAIL_PORT'),
      auth: {
        user: this.config.get('MAIL_USER'),
        pass: this.config.get('MAIL_PASS'),
      },
    });
    await transporter.sendMail({
      from: this.config.get('MAIL_FROM'),
      to: email,
      subject: 'Password Reset Link',
      html: `<h2>Your Reset Link is ${resetLink}</h2>`,
    });
  }
}
