import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterUserDto } from './dto/registerUser.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/loginUser.dto';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) { }

  async registerUser(registerUserDto: RegisterUserDto) {

    const { name, email, phone, password } = registerUserDto;

    const existingUser = await this.userService.findEmail(email);

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

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
      role: user.role
    }
    const token = await this.jwtService.signAsync(payload);
    return {
      message: "Email Verified Successfully",
      accessToken: token
    }

  }

  async login(loginUserDto: LoginUserDto) {

    const { email, password } = loginUserDto;

    const user = await this.userService.findEmailWithPassword(email);

    if (!user) {
      throw new BadRequestException('Invalid credentials');
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
}