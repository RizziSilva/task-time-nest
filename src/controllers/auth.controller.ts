import { Controller, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { RequestLoginUser } from '@decorators';
import { AuthLoginResponseDto, LoginResponseDto } from '@dtos';
import { AuthService } from '@services';
import { UserAuthGuard } from '@guards';

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
    const response: LoginResponseDto = await this.authService.login(user);

    res.cookie('access_token', response.token.access_token, {
      httpOnly: true,
      path: '/',
      sameSite: true,
    });

    res.cookie('refresh_token', response.token.refresh_token, {
      httpOnly: true,
      path: '/',
      sameSite: true,
    });

    return response;
  }
}
// const response: LoginResponseDto = await this.authService.login(user);

//     // res.cookie('access_token', response.token.access_token, {
//     //   httpOnly: true,
//     //   path: '/',
//     //   sameSite: true,
//     // });
//     // res.cookie('refresh_token', response.token.refresh_token, {
//     //   httpOnly: true,
//     //   path: '/',
//     //   sameSite: true,
//     // });

//     return response;
