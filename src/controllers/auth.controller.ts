import { Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { RequestUser } from '@decorators';
import { AuthLoginResponseDto } from '@dtos';
import { AuthService } from '@services';
import { UserAuthGuard, UserJwtAuthGuard } from '@guards';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(UserAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async login(@RequestUser() user: AuthLoginResponseDto): Promise<string> {
    return await this.authService.login(user);
  }

  @UseGuards(UserJwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('/test')
  async test(@RequestUser() user: AuthLoginResponseDto): Promise<string> {
    return;
  }
}
