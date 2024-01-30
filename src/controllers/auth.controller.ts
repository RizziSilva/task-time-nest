import { AuthLoginRequestDto, AuthLoginResponseDto } from '@dtos';
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '@services';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  async login(@Body() request: AuthLoginRequestDto): Promise<AuthLoginResponseDto> {
    return await this.authService.login(request);
  }
}
