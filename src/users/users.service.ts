import { Injectable } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>) { }
    async createUser(data: Partial<UserEntity>) {
        const user = this.userRepository.create(data);
        return this.userRepository.save(user);
    }
    async save(user: UserEntity) {
        return this.userRepository.save(user);
    }
    async findEmail(email: string) {
        return this.userRepository.findOne({
            where: { email }
        })
    }

    async findEmailWithPassword(email: string) {
        return this.userRepository.createQueryBuilder('user')
            .where('user.email = :email', { email })
            .addSelect('user.password')
            .getOne();
    }
}
