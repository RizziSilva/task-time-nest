import { AuthLoginResponseDto, TokensDto, LoginResponseDto } from '@dtos';
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
      const tokens: TokensDto = new TokensDto();
      const user: User = new User();
      const expected: LoginResponseDto = new LoginResponseDto();

      tokens.access_token = accessToken;
      tokens.refresh_token = refreshToken;

      expected.token = tokens;

      const result: LoginResponseDto = authMapper.fromTokensAndUserToLoginResponseDto(
        accessToken,
        refreshToken,
        user,
      );

      expect(result).toEqual(expected);
    });
  });
});
