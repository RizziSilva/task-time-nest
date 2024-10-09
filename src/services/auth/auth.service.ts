import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request, Response, CookieOptions } from 'express';
import { compare } from 'bcrypt';
import { User } from '@entities';
import { AuthLoginResponseDto, TokensDto } from '@dtos';
import {
  COOKIES_KEYS,
  REFRESH_TOKEN_EXPIRATION_TIME,
  UNAUTHORIZED_ACTION,
  UNAUTHORIZED_LOGIN,
} from '@constants';
import { UnauthorizedActionException, UnauthorizedException } from '@exceptions';
import { AuthMapper } from '@mappers';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    private authMapper: AuthMapper,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUserByNameAndEmail(email: string, password: string): Promise<AuthLoginResponseDto> {
    try {
      const user: User = await this.userService.findOneByEmail(email);

      if (!user) throw new UnauthorizedException(UNAUTHORIZED_LOGIN);

      const isCorrectUserPassword: boolean = await this.comparePasswords(user.password, password);

      if (!isCorrectUserPassword) throw new UnauthorizedException(UNAUTHORIZED_LOGIN);

      const response: AuthLoginResponseDto = this.authMapper.fromUserToAuthLoginResponse(user);

      return response;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  async validateUserById(id: number): Promise<AuthLoginResponseDto> {
    try {
      const user: User = await this.userService.findOneById(id);

      if (!user) throw new UnauthorizedException(UNAUTHORIZED_ACTION);

      const response: AuthLoginResponseDto = this.authMapper.fromUserToAuthLoginResponse(user);

      return response;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  async login(user: AuthLoginResponseDto): Promise<TokensDto> {
    const accessToken: string = await this.jwtService.signAsync(
      { id: user.id },
      {
        secret: this.configService.get<string>('JWT_KEY'),
      },
    );
    const refreshToken: string = await this.jwtService.signAsync(
      { id: user.id },
      {
        secret: this.configService.get<string>('JWT_KEY_REFRESH'),
        expiresIn: REFRESH_TOKEN_EXPIRATION_TIME,
      },
    );

    const response: TokensDto = this.authMapper.fromTokensToTokensDto(accessToken, refreshToken);
    await this.userService.updateRefreshToken(user.id, refreshToken);

    return response;
  }

  async refresh(request: Request, response: Response): Promise<void> {
    try {
      const requestToken: string = request.cookies[COOKIES_KEYS.REFRESH];

      if (!requestToken) throw new UnauthorizedActionException(UNAUTHORIZED_ACTION);

      const [_, refreshToken] = requestToken.split(' ') ?? [];
      const payload: AuthLoginResponseDto = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('JWT_KEY_REFRESH'),
      });
      const user: User = await this.userService.findOneById(payload.id);

      if (!user) throw new UnauthorizedActionException(UNAUTHORIZED_ACTION);

      const tokens: TokensDto = await this.login(payload);
      const cookieOptions: CookieOptions = {
        domain: this.configService.get<string>('REQUEST_ORIGIN'),
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      };

      response.cookie(COOKIES_KEYS.ACCESS, tokens.access_token, cookieOptions);
      response.cookie(COOKIES_KEYS.REFRESH, tokens.refresh_token, cookieOptions);
    } catch (error) {
      throw new UnauthorizedActionException(error);
    }
  }

  private async comparePasswords(userPassword: string, requestPassword: string): Promise<boolean> {
    return await compare(requestPassword, userPassword);
  }
}
