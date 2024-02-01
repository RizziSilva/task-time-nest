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
      user.name = 'Some Name';

      const expected: AuthLoginResponseDto = new AuthLoginResponseDto();
      expected.email = user.email;
      expected.name = user.name;

      const result: AuthLoginResponseDto = authMapper.fromUserToAuthLoginResponse(user);

      expect(result).toEqual(expected);
    });
  });
});
