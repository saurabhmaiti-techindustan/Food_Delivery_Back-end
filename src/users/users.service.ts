import { BadRequestException, Injectable } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateProfileDto } from './dto/updateProfile.dto';
import * as bcrypt from 'bcrypt';
import { SendOtp } from 'src/common/send_otp/sendOtp';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly mailService: MailService,
  ) {}
  async createUser(data: Partial<UserEntity>) {
    const user = this.userRepository.create(data);
    return this.userRepository.save(user);
  }
  async save(user: UserEntity) {
    return this.userRepository.save(user);
  }
  async findEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  async findEmailWithPassword(email: string) {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .addSelect('user.password')
      .getOne();
  }

  async findPasswordResetToken(token: string) {
    return this.userRepository.findOne({
      where: { passwordResetToken: token },
    });
  }

  async getUserProfile(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new BadRequestException('User not found ');
    }
    const { password, ...safe_user } = user;
    return safe_user;
  }

  async updateUserProfile(updateProfileDto: UpdateProfileDto, id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new BadRequestException('User not found ');
    }
    if (updateProfileDto.name) {
      user.name = updateProfileDto.name;
    }
    if (updateProfileDto.phone) {
      user.phone = updateProfileDto.phone;
    }
    if (updateProfileDto.password) {
      user.password = await bcrypt.hash(updateProfileDto.password, 10);
    }
    if (updateProfileDto.email && updateProfileDto.email !== user.email) {
      const emailTaken = await this.userRepository.findOne({
        where: { email: updateProfileDto.email },
      });
      if (emailTaken) {
        throw new BadRequestException('Email is already in use');
      }

      user.isEmailVerified = false;
      user.email = updateProfileDto.email;
      const sendOtp = new SendOtp();
      const otp = sendOtp.generateOtp();
      const otpExpiry = sendOtp.optExpiry();
      user.emailOtp = otp;
      user.emailOtpExpiry = otpExpiry;

      const savedUser = await this.userRepository.save(user);
      await this.mailService.sendOtp(savedUser.email, otp);

      const { password, emailOtp, emailOtpExpiry, ...safeUser } = savedUser;

      return {
        message: 'Otp sent, Please Verify Email',
        user: safeUser,
      };
    }

    const savedUser = await this.userRepository.save(user);
    const { password, emailOtp, emailOtpExpiry, ...safeUser } = savedUser;

    return {
      message: 'User Updated Successfully',
      user: safeUser,
    };
  }
}
