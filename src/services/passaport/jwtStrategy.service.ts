import { AuthLoginResponseDto } from '@dtos';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    const configService: ConfigService = new ConfigService();

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_KEY'),
    });
  }

  async validate(id: number): Promise<AuthLoginResponseDto> {
    const response: AuthLoginResponseDto = await this.authService.validateUserById(id);

    return response;
  }
}
