import { Injectable } from '@nestjs/common';
import { AuthLoginResponseDto, TokensDto, LoginResponseDto } from '@dtos';
import { User } from '@entities';

@Injectable()
export class AuthMapper {
  fromUserToAuthLoginResponse(entity: User) {
    const response: AuthLoginResponseDto = new AuthLoginResponseDto();

    response.id = entity.id;

    return response;
  }

  fromTokensAndUserToLoginResponseDto(
    accessToken: string,
    refreshToken: string,
    user: User,
  ): LoginResponseDto {
    const response: LoginResponseDto = new LoginResponseDto();
    const tokens: TokensDto = new TokensDto();

    tokens.access_token = accessToken;
    tokens.refresh_token = refreshToken;

    response.token = tokens;
    response.email = user.email;
    response.name = user.name;

    return response;
  }
}
