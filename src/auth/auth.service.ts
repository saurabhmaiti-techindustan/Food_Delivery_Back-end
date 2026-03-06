import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterUserDto } from './dto/registerUser.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/loginUser.dto';
import { MailService } from 'src/mail/mail.service';
import { ForgotPasswordDto } from './dto/forgotPassword.dto';
import * as crypto from 'crypto';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { SendOtp } from 'src/common/send_otp/sendOtp';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async registerUser(registerUserDto: RegisterUserDto) {
    const { name, email, phone, password } = registerUserDto;

    const existingUser = await this.userService.findEmail(email);

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const sendOtp = new SendOtp();
    const otp = sendOtp.generateOtp();
    const otpExpiry = sendOtp.optExpiry();

    const user = await this.userService.createUser({
      name,
      email,
      phone,
      password: hashedPassword,
      emailOtp: otp,
      emailOtpExpiry: otpExpiry,
    });

    await this.mailService.sendOtp(user.email, otp);

    return {
      message: 'User registered successfully. Please verify OTP.',
    };
  }

  async verifyOtp(email: string, otp: string) {
    const user = await this.userService.findEmail(email);
    if (!user) {
      throw new BadRequestException('User not Found');
    }
    if (user.emailOtp != otp) {
      throw new BadRequestException('Invalid OTP');
    }
    if (!user.emailOtpExpiry || user.emailOtpExpiry < new Date()) {
      throw new BadRequestException('OTP Expired');
    }
    user.isEmailVerified = true;
    user.emailOtp = null;
    user.emailOtpExpiry = null;
    await this.userService.save(user);
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    const token = await this.jwtService.signAsync(payload);
    return {
      message: 'Email Verified Successfully',
      accessToken: token,
    };
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    const user = await this.userService.findEmailWithPassword(email);

    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }
    if (!user.isEmailVerified) {
      throw new BadRequestException('Please verify your email first');
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new BadRequestException('Invalid credentials');
    }

    if (!user.isEmailVerified) {
      throw new BadRequestException('Email not verified');
    }

    const payload = {
      sub: user.id,
      role: user.role,
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      accessToken: token,
    };
  }

  async forgetPassword(forgetPasswordDto: ForgotPasswordDto) {
    const user = await this.userService.findEmail(forgetPasswordDto.email);
    if (!user) {
      throw new BadRequestException('Email not found ');
    }
    const token = crypto.randomBytes(32).toString('hex');
    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + 15);
    user.passwordResetToken = token;
    user.passwordResetExpireAt = expiry;
    await this.userService.save(user);
    const resetLink = `http://localhost:3000/auth/reset-password?token=${token}`;
    await this.mailService.sendPasswordResetLink(
      forgetPasswordDto.email,
      resetLink,
    );
    return {
      message: 'Password reset link sent to email',
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const user = await this.userService.findPasswordResetToken(
      resetPasswordDto.token,
    );
    if (!user) {
      throw new BadRequestException('Invalid Token');
    }
    if (
      !user.passwordResetExpireAt ||
      user.passwordResetExpireAt < new Date()
    ) {
      throw new BadRequestException('Token expired');
    }
    const newHashedPassword = await bcrypt.hash(
      resetPasswordDto.newPassword,
      10,
    );
    user.password = newHashedPassword;
    user.passwordResetToken = null;
    user.passwordResetExpireAt = null;
    await this.userService.save(user);
    return {
      message: 'Password Reset successfully',
    };
  }
}
