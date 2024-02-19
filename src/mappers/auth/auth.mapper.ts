import { Injectable } from '@nestjs/common';
import { AuthLoginResponseDto, TokensDto } from '@dtos';
import { User } from '@entities';

@Injectable()
export class AuthMapper {
  fromUserToAuthLoginResponse(entity: User) {
    const response: AuthLoginResponseDto = new AuthLoginResponseDto();

    response.id = entity.id;

    return response;
  }

  fromTokensToTokensDto(accessToken: string, refreshToken: string): TokensDto {
    const response: TokensDto = new TokensDto();

    response.access_token = accessToken;
    response.refresh_token = refreshToken;

    return response;
  }
}
