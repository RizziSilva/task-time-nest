import { ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { BEARER_TOKEN_TYPE } from '@constants';
import { AuthLoginResponseDto, TokensDto } from '@dtos';
import { AuthService, UserService } from '@services';
import { User } from '@entities';
import { UnauthorizedException } from '@exceptions';
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

    if (!tokens?.access_token) throw new UnauthorizedException();

    try {
      await this.handleTokens(request, response, tokens);
    } catch (error) {
      console.error('Erro na validação de tokens', error);
      throw new UnauthorizedException();
    }

    return true;
  }

  private async handleTokens(request: Request, response: Response, tokens: TokensDto) {
    try {
      const isValid: boolean = await this.handleAccessToken(request, response, tokens);

      if (!isValid) throw new UnauthorizedException();
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
      console.log('handleAccessToken', error);
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

      if (!user) throw new UnauthorizedException();

      await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('JWT_KEY_REFRESH'),
      });

      const tokens: TokensDto = await this.authService.login(userAuthResponse);

      request['user'] = userAuthResponse;
      response.setHeader('access_token', tokens.access_token);
      response.setHeader('refresh_token', tokens.refresh_token);

      return true;
    } catch (error) {
      throw error;
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
