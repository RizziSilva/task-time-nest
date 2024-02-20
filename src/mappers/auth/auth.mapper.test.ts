import { AuthLoginResponseDto, TokensDto } from '@dtos';
import { User } from '@entities';
import { AuthMapper } from './auth.mapper';

describe('AuthMapper Tests', () => {
  let authMapper: AuthMapper;

  beforeEach(() => {
    authMapper = new AuthMapper();
  });

  describe('fromUserToAuthLoginResponse Tests', () => {
    it('Creates auth response from user', () => {
      const user: User = new User();
      user.id = 123;

      const expected: AuthLoginResponseDto = new AuthLoginResponseDto();
      expected.id = user.id;

      const result: AuthLoginResponseDto = authMapper.fromUserToAuthLoginResponse(user);

      expect(result).toEqual(expected);
    });
  });

  describe('fromTokensToTokensDto Tests', () => {
    it('Convert tokens to tokensDto', () => {
      const accessToken: string = 'AccessToken';
      const refreshToken: string = 'RefreshToken';
      const expected: TokensDto = new TokensDto();
      expected.access_token = accessToken;
      expected.refresh_token = refreshToken;

      const result: TokensDto = authMapper.fromTokensToTokensDto(accessToken, refreshToken);

      expect(result).toEqual(expected);
    });
  });
});
