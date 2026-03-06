import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}
  @UseGuards(AuthGuard)
  @Get('/profile')
  async getProfile(@Req() req: Request) {
    const userId = req['user'].sub;
    const user = await this.userService.getUserProfile(userId);
    return {
      message: 'User Profile',
      user,
    };
  }
}
