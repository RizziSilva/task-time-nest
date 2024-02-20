import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Repository, UpdateResult } from 'typeorm';
import bcrypt from 'bcrypt';
import { UserValidator } from '@validators';
import { User } from '@entities';
import { AuthMapper, UserMapper } from '@mappers';
import { UserController } from '@controllers';
import {
  AuthLoginResponseDto,
  UserCreateRequestDto,
  UserCreateResponseDto,
  UserUpdateRequestDto,
  UserUpdateResponseDto,
} from '@dtos';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';

describe('UserService Tests', () => {
  let userService: UserService;
  let userRepository: Repository<User>;
  let userMapper: UserMapper;
  let userValidator: UserValidator;

  beforeEach(async () => {
    const ref: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        UserMapper,
        UserValidator,
        ConfigService,
        AuthService,
        AuthMapper,
        JwtService,
        {
          provide: getRepositoryToken(User),
          useValue: { save: jest.fn(), update: jest.fn(), findOneBy: jest.fn() },
        },
      ],
    }).compile();

    userService = ref.get<UserService>(UserService);
    userRepository = ref.get<Repository<User>>(getRepositoryToken(User));
    userMapper = ref.get<UserMapper>(UserMapper);
    userValidator = ref.get<UserValidator>(UserValidator);
  });

  describe('create Tests', () => {
    it('Creates a user with success', async () => {
      const request: UserCreateRequestDto = new UserCreateRequestDto();
      const user: User = new User();
      const response: UserCreateResponseDto = new UserCreateResponseDto();

      jest.spyOn(userValidator, 'validateCreateUserRequest').mockImplementationOnce(() => {});
      jest.spyOn(userMapper, 'fromCreateRequestToUser').mockImplementationOnce(() => user);
      jest.spyOn(userRepository, 'save').mockResolvedValueOnce(user);
      jest.spyOn(userMapper, 'fromUserToCreateResponse').mockImplementationOnce(() => response);
      jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => Promise.resolve(''));

      const result: UserCreateResponseDto = await userService.create(request);

      expect(result).toBe(response);
      expect(userMapper.fromCreateRequestToUser).toHaveBeenCalled();
      expect(userMapper.fromUserToCreateResponse).toHaveBeenCalled();
      expect(userRepository.save).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalled();
    });
  });

  describe('update Tests', () => {
    it('Updates a user with success', async () => {
      const userAuth: AuthLoginResponseDto = new AuthLoginResponseDto();
      const request: UserUpdateRequestDto = new UserUpdateRequestDto();
      const user: User = new User();
      const response: UserUpdateResponseDto = new UserUpdateResponseDto();

      jest.spyOn(userValidator, 'validateUserUpdateRequest').mockImplementationOnce(() => {});
      jest.spyOn(userService, 'updateById').mockResolvedValueOnce(user);
      jest.spyOn(userMapper, 'fromUserToUpdateUserResponse').mockImplementationOnce(() => response);

      const result: UserUpdateResponseDto = await userService.update(request, userAuth);

      expect(result).toBe(response);
      expect(userMapper.fromUserToUpdateUserResponse).toHaveBeenCalled();
      expect(userValidator.validateUserUpdateRequest).toHaveBeenCalled();
      expect(userService.updateById).toHaveBeenCalled();
    });
  });

  describe('updateById Tests', () => {
    it('Update by id with success', async () => {
      const request: UserUpdateRequestDto = new UserUpdateRequestDto();
      const response: User = new User();
      const currentUserId: number = 1;
      const updateResponse: UpdateResult = new UpdateResult();

      jest.spyOn(userRepository, 'update').mockResolvedValueOnce(updateResponse);
      jest.spyOn(userService, 'findOneById').mockResolvedValueOnce(response);

      const result: User = await userService.updateById(currentUserId, request);

      expect(result).toBe(response);
      expect(userRepository.update).toHaveBeenCalled();
      expect(userService.findOneById).toHaveBeenCalledWith(currentUserId);
    });
  });

  describe('findOneById Tests', () => {
    it('Find one by id with success', async () => {
      const currentUserId: number = 1;
      const user: User = new User();

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValueOnce(user);

      const result: User = await userService.findOneById(currentUserId);

      expect(result).toBe(user);
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: currentUserId });
    });
  });

  describe('findOneByEmail Tests', () => {
    it('Find one by email with success', async () => {
      const email: string = 'some.email@provider.com';
      const user: User = new User();

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValueOnce(user);

      const result: User = await userService.findOneByEmail(email);

      expect(result).toBe(user);
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ email });
    });
  });

  describe('findOneByRefreshToken Tests', () => {
    it('Find one by refresh token with success', async () => {
      const refreshToken: string = 'asdfgkjhmWQESDGdfkgmoikcawe123w3e5';
      const user: User = new User();

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValueOnce(user);

      const result: User = await userService.findOneByRefreshToken(refreshToken);

      expect(result).toBe(user);
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ refreshToken });
    });
  });

  describe('updateRefreshToken Tests', () => {
    it('Update refresh token by id with success', async () => {
      const updateResponse: UpdateResult = new UpdateResult();
      const refreshToken: string = 'asdfgkjhmWQESDGdfkgmoikcawe123w3e5';
      const userId: number = 1;

      jest.spyOn(userRepository, 'update').mockResolvedValueOnce(updateResponse);

      await userService.updateRefreshToken(userId, refreshToken);

      expect(userRepository.update).toHaveBeenCalledWith({ id: userId }, { refreshToken });
    });
  });
});
