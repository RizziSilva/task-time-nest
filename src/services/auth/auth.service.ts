import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { compare } from 'bcrypt';
import { User } from '@entities';
import { AuthLoginRequestDto, AuthLoginResponseDto } from '@dtos';
import { UNAUTHORIZED_LOGIN } from '@constants';
import { AuthMapper } from '@mappers';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(private userService: UserService, private authMapper: AuthMapper) {}

  async login(request: AuthLoginRequestDto): Promise<AuthLoginResponseDto> {
    const user: User = await this.userService.findOneByEmail(request.email);

    if (!user) {
      throw new HttpException(
        { status: HttpStatus.UNAUTHORIZED, error: UNAUTHORIZED_LOGIN },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const isCorrectUserPassword: boolean = await this.comparePasswords(
      user.password,
      request.password,
    );

    if (!isCorrectUserPassword) {
      throw new HttpException(
        { status: HttpStatus.UNAUTHORIZED, error: UNAUTHORIZED_LOGIN },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const response: AuthLoginResponseDto = this.authMapper.fromUserToAuthLoginResponse(user);

    return response;
  }

  private async comparePasswords(userPassword: string, requestPassword: string): Promise<boolean> {
    return await compare(requestPassword, userPassword);
  }
}
