import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import bcrypt from 'bcrypt';
import { AuthController } from '@controllers';
import { AuthLoginRequestDto, AuthLoginResponseDto, TokensDto, LoginResponseDto } from '@dtos';
import { User } from '@entities';
import { UnauthorizedException } from '@exceptions';
import { AuthMapper, UserMapper } from '@mappers';
import { UserValidator } from '@validators';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';

describe('AuthService Tests', () => {
  let authService: AuthService;
  let authMapper: AuthMapper;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const ref: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: getRepositoryToken(User),
          useValue: { findOneBy: jest.fn(), update: jest.fn() },
        },
        UserService,
        AuthService,
        AuthMapper,
        UserValidator,
        UserMapper,
        JwtService,
        ConfigService,
      ],
    }).compile();

    authService = ref.get<AuthService>(AuthService);
    authMapper = ref.get<AuthMapper>(AuthMapper);
    userService = ref.get<UserService>(UserService);
    jwtService = ref.get<JwtService>(JwtService);

    jest.resetAllMocks();
  });

  describe('login Tests', () => {
    it('Login with Success', async () => {
      const request: AuthLoginResponseDto = new AuthLoginResponseDto();
      const tokens: TokensDto = new TokensDto();
      const user: User = new User();
      const response: LoginResponseDto = new LoginResponseDto();

      tokens.access_token = '';
      tokens.refresh_token = '';

      response.token = tokens;
      response.email = user.email;
      response.name = user.name;

      jest.spyOn(userService, 'updateRefreshToken').mockImplementationOnce(() => Promise.resolve());
      jest.spyOn(jwtService, 'signAsync').mockImplementation(() => Promise.resolve(''));
      jest.spyOn(authMapper, 'fromTokensAndUserToLoginResponseDto').mockReturnValueOnce(response);

      const result: LoginResponseDto = await authService.login(request);

      expect(result).toEqual(response);
      expect(userService.updateRefreshToken).toHaveBeenCalled();
      expect(jwtService.signAsync).toHaveBeenCalledTimes(2);
      expect(authMapper.fromTokensAndUserToLoginResponseDto).toHaveBeenCalled();
    });
  });

  describe('validateUserById Tests', () => {
    it('Validate user by id with success', async () => {
      const id: number = 1;
      const user: User = new User();
      const response: AuthLoginResponseDto = new AuthLoginResponseDto();

      jest.spyOn(userService, 'findOneById').mockResolvedValueOnce(user);
      jest.spyOn(authMapper, 'fromUserToAuthLoginResponse').mockImplementation(() => response);

      const result: AuthLoginResponseDto = await authService.validateUserById(id);

      expect(result).toBe(response);
      expect(userService.findOneById).toHaveBeenCalled();
      expect(authMapper.fromUserToAuthLoginResponse).toHaveBeenCalled();
    });

    it('Validate user by id with missing user with error', async () => {
      const id: number = 1;
      const response: AuthLoginResponseDto = new AuthLoginResponseDto();

      jest.spyOn(userService, 'findOneById').mockImplementationOnce(() => Promise.resolve(null));
      jest.spyOn(authMapper, 'fromUserToAuthLoginResponse').mockImplementation(() => response);

      expect(authService.validateUserById(id)).rejects.toThrow(UnauthorizedException);
      expect(userService.findOneById).toHaveBeenCalled();
      expect(authMapper.fromUserToAuthLoginResponse).not.toHaveBeenCalled();
    });
  });

  describe('validateUserByNameAndEmail Tests', () => {
    it('Validate user with success', async () => {
      const user: User = new User();
      const email: string = 'some.email@email.com';
      const password: string = 'Valid@12345';
      const response: AuthLoginResponseDto = new AuthLoginResponseDto();

      jest.spyOn(userService, 'findOneByEmail').mockResolvedValueOnce(user);
      jest.spyOn(authMapper, 'fromUserToAuthLoginResponse').mockImplementationOnce(() => response);
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => Promise.resolve(true));

      const result: AuthLoginResponseDto = await authService.validateUserByNameAndEmail(
        email,
        password,
      );

      expect(result).toBe(response);
      expect(userService.findOneByEmail).toHaveBeenCalledWith(email);
      expect(authMapper.fromUserToAuthLoginResponse).toHaveBeenCalled();
      expect(bcrypt.compare).toHaveBeenCalled();
    });

    it('Validate user with wrong email with error', async () => {
      const request: AuthLoginRequestDto = new AuthLoginRequestDto();

      jest.spyOn(userService, 'findOneByEmail').mockImplementationOnce(() => Promise.resolve(null));
      jest.spyOn(authMapper, 'fromUserToAuthLoginResponse');
      jest.spyOn(bcrypt, 'compare');

      await expect(
        authService.validateUserByNameAndEmail(request.email, request.password),
      ).rejects.toThrow(UnauthorizedException);
      expect(userService.findOneByEmail).toHaveBeenCalled();
      expect(userService.findOneByEmail).toHaveBeenCalledWith(request.email);
      expect(authMapper.fromUserToAuthLoginResponse).not.toHaveBeenCalled();
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it('Validate user with wrong password with error', async () => {
      const request: AuthLoginRequestDto = new AuthLoginRequestDto();
      const user: User = new User();

      jest.spyOn(userService, 'findOneByEmail').mockImplementationOnce(() => Promise.resolve(user));
      jest.spyOn(authMapper, 'fromUserToAuthLoginResponse');
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => Promise.resolve(false));

      await expect(
        authService.validateUserByNameAndEmail(request.email, request.password),
      ).rejects.toThrow(UnauthorizedException);
      expect(userService.findOneByEmail).toHaveBeenCalled();
      expect(userService.findOneByEmail).toHaveBeenCalledWith(request.email);
      expect(bcrypt.compare).toHaveBeenCalled();
      expect(authMapper.fromUserToAuthLoginResponse).not.toHaveBeenCalled();
    });
  });
});
