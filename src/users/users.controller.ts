import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/updateProfile.dto';

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
  @UseGuards(AuthGuard)
  @Patch('/profile')
  async updateProfile(
    @Req() req: Request,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const userId = req['user'].sub;
    const result = await this.userService.updateUserProfile(
      updateProfileDto,
      userId,
    );
    return result;
  }
}
