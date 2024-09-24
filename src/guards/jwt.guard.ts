import { ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Response, Request, CookieOptions } from 'express';
import { BEARER_TOKEN_TYPE, UNAUTHORIZED_ACTION } from '@constants';
import { AuthLoginResponseDto, TokensDto, LoginResponseDto } from '@dtos';
import { AuthService, UserService } from '@services';
import { User } from '@entities';
import { UnauthorizedActionException } from '@exceptions';
import { UserMapper } from '@mappers';

@Injectable()
export class UserJwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private userService: UserService,
    private authService: AuthService,
    private userMapper: UserMapper,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const response: Response = context.switchToHttp().getResponse();
    const tokens: TokensDto = this.extractTokensFromHeader(request);
    console.log('request', request);
    if (!tokens?.access_token) throw new UnauthorizedActionException(UNAUTHORIZED_ACTION);

    try {
      await this.handleTokens(request, response, tokens);
    } catch (error) {
      throw new UnauthorizedActionException(error);
    }

    return true;
  }

  private async handleTokens(request: Request, response: Response, tokens: TokensDto) {
    try {
      const isValid: boolean = await this.handleAccessToken(request, response, tokens);

      if (!isValid) throw new UnauthorizedActionException(UNAUTHORIZED_ACTION);
    } catch (error) {
      throw error;
    }
  }

  private async handleAccessToken(
    request: Request,
    response: Response,
    tokens: TokensDto,
  ): Promise<boolean> {
    try {
      const payload: AuthLoginResponseDto = await this.jwtService.verifyAsync(tokens.access_token, {
        secret: this.configService.get<string>('JWT_KEY'),
      });

      request['user'] = payload;

      return true;
    } catch (error) {
      const isValid: boolean = await this.handleRefreshToken(
        request,
        response,
        tokens.refresh_token,
      );

      return isValid;
    }
  }

  private async handleRefreshToken(
    request: Request,
    response: Response,
    refreshToken: string,
  ): Promise<boolean> {
    try {
      const user: User = await this.userService.findOneByRefreshToken(refreshToken);
      const userAuthResponse: AuthLoginResponseDto = this.userMapper.fromUserToCreateResponse(user);

      if (!user) throw new UnauthorizedActionException(UNAUTHORIZED_ACTION);

      await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('JWT_KEY_REFRESH'),
      });

      const loginResponse: LoginResponseDto = await this.authService.login(userAuthResponse);
      const cookieOptions: CookieOptions = {
        domain: this.configService.get<string>('REQUEST_ORIGIN'),
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      };

      request['user'] = userAuthResponse;
      response.cookie('access_token', loginResponse.token.access_token, cookieOptions);
      response.cookie('refresh_token', loginResponse.token.refresh_token, cookieOptions);

      return true;
    } catch (error) {
      return false;
    }
  }

  private extractTokensFromHeader(request: Request): TokensDto {
    const [accessType, accessToken] = request.cookies.access_token?.split(' ') ?? [];
    const [refreshType, refreshToken] = request.cookies.refresh_token?.split(' ') ?? [];
    const isTokensBearer = [accessType, refreshType].every((type) => type === BEARER_TOKEN_TYPE);
    const tokens: TokensDto = new TokensDto();

    tokens.access_token = accessToken;
    tokens.refresh_token = refreshToken;

    return isTokensBearer ? tokens : undefined;
  }
}
