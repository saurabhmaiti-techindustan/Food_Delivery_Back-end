import { BadRequestException, Injectable } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
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
}
