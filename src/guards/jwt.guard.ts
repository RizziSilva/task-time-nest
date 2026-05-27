import { ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Response, Request } from 'express';
import { BEARER_TOKEN_TYPE, COOKIES_KEYS, UNAUTHORIZED_ACTION } from '@constants';
import { AuthLoginResponseDto, TokensDto } from '@dtos';
import { UnauthorizedActionException } from '@exceptions';

@Injectable()
export class UserJwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const tokens: TokensDto | undefined = this.extractTokensFromHeader(request);

    if (!tokens?.access_token) throw new UnauthorizedActionException(UNAUTHORIZED_ACTION);

    try {
      await this.handleTokens(request, tokens);
    } catch (error) {
      throw new UnauthorizedActionException(error);
    }

    return true;
  }

  private async handleTokens(request: Request, tokens: TokensDto) {
    try {
      const isValid: boolean = await this.handleAccessToken(request, tokens);

      if (!isValid) throw new UnauthorizedActionException(UNAUTHORIZED_ACTION);
    } catch (error) {
      throw error;
    }
  }

  private async handleAccessToken(request: Request, tokens: TokensDto): Promise<boolean> {
    try {
      const payload: AuthLoginResponseDto = await this.jwtService.verifyAsync(tokens.access_token, {
        secret: this.configService.get<string>('JWT_KEY'),
      });

      request['user'] = payload;

      return true;
    } catch (error) {
      throw error;
    }
  }

  private getAccessFromRequest(request: Request): string {
    const requestAuthorization = request.headers.authorization;

    if (requestAuthorization) return requestAuthorization;

    return request.cookies[COOKIES_KEYS.ACCESS];
  }

  private extractTokensFromHeader(request: Request): TokensDto | undefined {
    const requestAccessToken: string = this.getAccessFromRequest(request);

    const [accessType, accessToken] = requestAccessToken?.split(' ') ?? [];
    const isTokensBearer = accessType === BEARER_TOKEN_TYPE;

    if (!isTokensBearer) return undefined;

    const tokens: TokensDto = new TokensDto();

    tokens.access_token = accessToken;

    return tokens;
  }
}
