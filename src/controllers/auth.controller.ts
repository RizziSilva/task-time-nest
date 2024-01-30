import { AuthLoginResponseDto } from '@dtos';
import { Controller, HttpCode, HttpStatus, Post, Request } from '@nestjs/common';
import { AuthService } from '@services';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async login(@Request() request): Promise<AuthLoginResponseDto> {
    return request.user;
  }
}
