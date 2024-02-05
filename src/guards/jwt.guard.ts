import { ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { BEARER_TOKEN_TYPE, UNAUTHORIZED_ACTION } from '@constants';
import { AuthLoginResponseDto, TokensDto } from '@dtos';
import { AuthService, UserService } from '@services';
import { User } from '@entities';

@Injectable()
export class UserJwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private userService: UserService,
    private authService: AuthService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const tokens: TokensDto = this.extractTokensFromHeader(request);
    const unauthorizedError: HttpException = new HttpException(
      { status: HttpStatus.UNAUTHORIZED, error: UNAUTHORIZED_ACTION },
      HttpStatus.UNAUTHORIZED,
    );

    if (!tokens?.access_token) throw unauthorizedError;

    try {
      this.handleTokens(request, tokens);
    } catch {
      throw unauthorizedError;
    }

    return true;
  }

  private async handleTokens(request: Request, tokens: TokensDto) {
    console.log('tokens', tokens.access_token);
    try {
      const payload: AuthLoginResponseDto = await this.jwtService.verifyAsync(tokens.access_token, {
        secret: this.configService.get<string>('JWT_KEY'),
      });

      request['user'] = payload;
    } catch {
      const user: User = await this.userService.findOneByRefreshToken(tokens.refresh_token);

      if (!user) throw new Error();

      const payload: AuthLoginResponseDto = await this.jwtService.verifyAsync(
        tokens.refresh_token,
        {
          secret: this.configService.get<string>('JWT_KEY_REFRESH'),
        },
      );

      this.authService.login(payload);
    }
  }

  private extractTokensFromHeader(request: Request): TokensDto {
    const [accessType, accessToken] = request.headers['authorization']?.split(' ') ?? [];
    const [refreshType, refreshToken] = request.headers['refreshtoken']?.split(' ') ?? [];
    const isTokensBearer = [accessType, refreshType].every((type) => type === BEARER_TOKEN_TYPE);
    const tokens: TokensDto = new TokensDto();

    tokens.access_token = accessToken;
    tokens.refresh_token = refreshToken;

    return isTokensBearer ? tokens : undefined;
  }
}
