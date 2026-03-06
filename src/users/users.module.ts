import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { MailModule } from 'src/mail/mail.module';
import { RestaurantEntity } from 'src/restaurants/entities/restaurant.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity,RestaurantEntity]),
    forwardRef(() => AuthModule),
    MailModule,
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
