import { HttpException, HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { compare } from 'bcrypt';
import { User } from '@entities';
import { AuthLoginResponseDto, TokensDto } from '@dtos';
import { REFRESH_TOKEN_EXPIRATION_TIME, UNAUTHORIZED_LOGIN } from '@constants';
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

  async validateUser(email: string, password: string): Promise<AuthLoginResponseDto> {
    const user: User = await this.userService.findOneByEmail(email);
    const unauthorizedLoginError: HttpException = new HttpException(
      { status: HttpStatus.UNAUTHORIZED, error: UNAUTHORIZED_LOGIN },
      HttpStatus.UNAUTHORIZED,
    );

    if (!user) throw unauthorizedLoginError;

    const isCorrectUserPassword: boolean = await this.comparePasswords(user.password, password);

    if (!isCorrectUserPassword) throw unauthorizedLoginError;

    const response: AuthLoginResponseDto = this.authMapper.fromUserToAuthLoginResponse(user);

    return response;
  }

  async login(user: AuthLoginResponseDto): Promise<TokensDto> {
    const tokens: TokensDto = new TokensDto();
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

    tokens.refresh_token = refreshToken;
    tokens.access_token = accessToken;

    await this.userService.updateRefreshToken(user.id, refreshToken);

    return tokens;
  }

  private async comparePasswords(userPassword: string, requestPassword: string): Promise<boolean> {
    return await compare(requestPassword, userPassword);
  }
}
