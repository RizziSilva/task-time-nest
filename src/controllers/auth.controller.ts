import { Controller, HttpCode, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { RequestLoginUser } from '@decorators';
import { AuthLoginResponseDto, LoginResponseDto } from '@dtos';
import { UserAuthGuard } from '@guards';
import { AuthService } from '@services';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(UserAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async login(
    @Res({ passthrough: true }) res: Response,
    @RequestLoginUser() user: AuthLoginResponseDto,
  ): Promise<LoginResponseDto> {
    return await this.authService.login(user);
  }
}
