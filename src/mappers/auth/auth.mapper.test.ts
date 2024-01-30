import { AuthLoginResponseDto } from '@dtos';
import { User } from '@entities';
import { AuthMapper } from './auth.mapper';

describe('AuthMapper Tests', () => {
  let authMapper: AuthMapper;

  beforeEach(() => {
    authMapper = new AuthMapper();
  });

  describe('fromUserToAuthLoginResponse Tests', () => {
    it('creates auth response from user', () => {
      const user: User = new User();
      user.email = 'some.email@email.com';

      const expected: AuthLoginResponseDto = new AuthLoginResponseDto();
      expected.refreshToken = user.email;
      expected.token = user.email;

      const result: AuthLoginResponseDto = authMapper.fromUserToAuthLoginResponse(user);

      expect(result).toEqual(expected);
    });
  });
});
