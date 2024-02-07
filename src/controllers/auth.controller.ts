import { Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { RequestUser } from '@decorators';
import { AuthLoginResponseDto, TokensDto } from '@dtos';
import { AuthService } from '@services';
import { UserAuthGuard } from '@guards';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(UserAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async login(@RequestUser() user: AuthLoginResponseDto): Promise<TokensDto> {
    return await this.authService.login(user);
  }
}
