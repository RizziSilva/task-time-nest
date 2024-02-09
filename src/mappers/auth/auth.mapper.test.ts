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
      user.id = 123;

      const expected: AuthLoginResponseDto = new AuthLoginResponseDto();
      expected.id = user.id;

      const result: AuthLoginResponseDto = authMapper.fromUserToAuthLoginResponse(user);

      expect(result).toEqual(expected);
    });
  });
});
