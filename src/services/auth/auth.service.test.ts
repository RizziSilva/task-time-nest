import { Test, TestingModule } from '@nestjs/testing';
import bcrypt from 'bcrypt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthController } from '@controllers';
import { AuthMapper } from '@mappers';
import { AuthLoginRequestDto, AuthLoginResponseDto } from '@dtos';
import { User } from '@entities';
import { UserModule } from '@modules';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import typeOrmConfig from 'typeOrm.config';

describe('AuthService tests', () => {
  let authService: AuthService;
  let authMapper: AuthMapper;
  let userService: UserService;

  beforeEach(async () => {
    const ref: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService, AuthMapper],
      imports: [UserModule],
    }).compile();

    authService = ref.get<AuthService>(AuthService);
    authMapper = ref.get<AuthMapper>(AuthMapper);
    userService = ref.get<UserService>(UserService);
  });

  describe('Login tests', () => {
    it('Login with Success', async () => {
      const request: AuthLoginRequestDto = new AuthLoginRequestDto();
      const user: User = new User();
      const response: AuthLoginResponseDto = new AuthLoginResponseDto();

      jest.spyOn(userService, 'findOneByEmail').mockResolvedValueOnce(user);
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => Promise.resolve(true));
      jest.spyOn(authMapper, 'fromUserToAuthLoginResponse').mockImplementationOnce(() => response);

      const result: AuthLoginResponseDto = await authService.login(request);

      expect(result).toEqual(response);
      expect(userService.findOneByEmail).toHaveBeenCalled();
      expect(userService.findOneByEmail).toHaveBeenCalledWith(request.email);
      expect(authMapper.fromUserToAuthLoginResponse).toHaveBeenCalled();
      expect(authMapper.fromUserToAuthLoginResponse).toHaveBeenCalledWith(user);
      expect(bcrypt.compare).toHaveBeenCalled();
    });
  });
});
