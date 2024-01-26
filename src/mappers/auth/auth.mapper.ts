import { Injectable } from '@nestjs/common';
import { AuthLoginResponseDto } from '@dtos';
import { User } from '@entities';

@Injectable()
export class AuthMapper {
  fromUserToAuthLoginResponse(entity: User) {
    const response: AuthLoginResponseDto = new AuthLoginResponseDto();

    response.token = `${entity.email}`;
    response.refreshToken = `${entity.email}`;

    return response;
  }
}
