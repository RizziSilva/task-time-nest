import { Test, TestingModule } from '@nestjs/testing';
import bcrypt from 'bcrypt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthController } from '@controllers';
import { AuthMapper, UserMapper } from '@mappers';
import { AuthLoginRequestDto, AuthLoginResponseDto } from '@dtos';
import { User } from '@entities';
import { UserModule } from '@modules';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { UserCreateValidator } from '@validators';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UNAUTHORIZED_LOGIN } from '@constants';

describe('AuthService tests', () => {
  let authService: AuthService;
  let authMapper: AuthMapper;
  let userService: UserService;

  beforeEach(async () => {
    const ref: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: getRepositoryToken(User), useValue: { findOneBy: jest.fn() } },
        UserService,
        AuthService,
        AuthMapper,
        UserCreateValidator,
        UserMapper,
      ],
    }).compile();

    authService = ref.get<AuthService>(AuthService);
    authMapper = ref.get<AuthMapper>(AuthMapper);
    userService = ref.get<UserService>(UserService);

    jest.resetAllMocks();
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

    it('Login with error using wrong email', async () => {
      const request: AuthLoginRequestDto = new AuthLoginRequestDto();

      jest.spyOn(userService, 'findOneByEmail').mockResolvedValueOnce(null);
      jest.spyOn(authMapper, 'fromUserToAuthLoginResponse');
      jest.spyOn(bcrypt, 'compare');

      const httpError: HttpException = new HttpException(
        { status: HttpStatus.UNAUTHORIZED, error: UNAUTHORIZED_LOGIN },
        HttpStatus.UNAUTHORIZED,
      );

      await expect(authService.login(request)).rejects.toThrow(httpError);
      expect(userService.findOneByEmail).toHaveBeenCalled();
      expect(userService.findOneByEmail).toHaveBeenCalledWith(request.email);
      expect(authMapper.fromUserToAuthLoginResponse).not.toHaveBeenCalled();
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it('Login with error using wrong password', async () => {
      const request: AuthLoginRequestDto = new AuthLoginRequestDto();
      const user: User = new User();

      jest.spyOn(userService, 'findOneByEmail').mockResolvedValueOnce(user);
      jest.spyOn(authMapper, 'fromUserToAuthLoginResponse');
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => Promise.resolve(false));

      const httpError: HttpException = new HttpException(
        { status: HttpStatus.UNAUTHORIZED, error: UNAUTHORIZED_LOGIN },
        HttpStatus.UNAUTHORIZED,
      );

      await expect(authService.login(request)).rejects.toThrow(httpError);
      expect(userService.findOneByEmail).toHaveBeenCalled();
      expect(userService.findOneByEmail).toHaveBeenCalledWith(request.email);
      expect(bcrypt.compare).toHaveBeenCalled();
      expect(authMapper.fromUserToAuthLoginResponse).not.toHaveBeenCalled();
    });
  });
});
