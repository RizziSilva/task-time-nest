import { HttpException, HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { compare } from 'bcrypt';
import { User } from '@entities';
import { AuthLoginResponseDto, TokensDto } from '@dtos';
import { REFRESH_TOKEN_EXPIRATION_TIME, UNAUTHORIZED_LOGIN } from '@constants';
import { AuthMapper } from '@mappers';
import { UserService } from '../user/user.service';
import { UnauthorizedException } from '@exceptions';

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

      if (!user) throw new UnauthorizedException();

      const isCorrectUserPassword: boolean = await this.comparePasswords(user.password, password);

      if (!isCorrectUserPassword) throw new UnauthorizedException();

      const response: AuthLoginResponseDto = this.authMapper.fromUserToAuthLoginResponse(user);

      return response;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  async validateUserById(id: number): Promise<AuthLoginResponseDto> {
    try {
      const user: User = await this.userService.findOneById(id);

      if (!user) throw new UnauthorizedException();

      const response: AuthLoginResponseDto = this.authMapper.fromUserToAuthLoginResponse(user);

      return response;
    } catch {
      throw new UnauthorizedException();
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

  private async comparePasswords(userPassword: string, requestPassword: string): Promise<boolean> {
    return await compare(requestPassword, userPassword);
  }
}
