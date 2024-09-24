import { Controller, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { RequestLoginUser } from '@decorators';
import { AuthLoginResponseDto, TokensDto } from '@dtos';
import { AuthService } from '@services';
import { UserAuthGuard } from '@guards';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(UserAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async login(@RequestLoginUser() user: AuthLoginResponseDto): Promise<TokensDto> {
    return await this.authService.login(user);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/refresh')
  async refresh(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    console.log('request', request.rawHeaders);
    console.log('request', request.headers.cookie);

    return await this.authService.refresh(request, response);
  }
}
