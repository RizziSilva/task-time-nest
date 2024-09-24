import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { compare } from 'bcrypt';
import { User } from '@entities';
import { AuthLoginResponseDto, LoginResponseDto } from '@dtos';
import {
  ACCESS_TOKEN_EXPIRATION_TIME,
  REFRESH_TOKEN_EXPIRATION_TIME,
  UNAUTHORIZED_ACTION,
  UNAUTHORIZED_LOGIN,
} from '@constants';
import { AuthMapper } from '@mappers';
import { UnauthorizedException } from '@exceptions';
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

  async login(user: AuthLoginResponseDto): Promise<LoginResponseDto> {
    const accessToken: string = await this.jwtService.signAsync(
      { id: user.id },
      {
        secret: this.configService.get<string>('JWT_KEY'),
        expiresIn: ACCESS_TOKEN_EXPIRATION_TIME,
      },
    );
    const refreshToken: string = await this.jwtService.signAsync(
      { id: user.id },
      {
        secret: this.configService.get<string>('JWT_KEY_REFRESH'),
        expiresIn: REFRESH_TOKEN_EXPIRATION_TIME,
      },
    );
    const userEntity: User = await this.userService.findOneById(user.id);
    const response: LoginResponseDto = this.authMapper.fromTokensAndUserToLoginResponseDto(
      accessToken,
      refreshToken,
      userEntity,
    );
    await this.userService.updateRefreshToken(user.id, refreshToken);

    return response;
  }

  private async comparePasswords(userPassword: string, requestPassword: string): Promise<boolean> {
    return await compare(requestPassword, userPassword);
  }
}
