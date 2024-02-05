import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { compare } from 'bcrypt';
import { User } from '@entities';
import { AuthLoginResponseDto, TokensDto } from '@dtos';
import { UNAUTHORIZED_LOGIN } from '@constants';
import { AuthMapper } from '@mappers';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
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
    const accessToken: string = await this.jwtService.signAsync(user);
    const refreshToken: string = await this.jwtService.signAsync(user, {
      secret: this.configService.get<string>('JWT_KEY_REFRESH'),
    });

    tokens.refresh_token = refreshToken;
    tokens.access_token = accessToken;

    await this.userService.updateRefreshToken(user.email, refreshToken);

    return tokens;
  }

  private async comparePasswords(userPassword: string, requestPassword: string): Promise<boolean> {
    return await compare(requestPassword, userPassword);
  }
}
