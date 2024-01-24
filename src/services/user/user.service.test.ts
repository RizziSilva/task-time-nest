import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserCreateValidator } from '@validators';
import { User } from '@entities';
import { UserMapper } from '@mappers';
import { UserController } from '@controllers';
import { UserCreateRequest, UserCreateResponse } from '@dtos';
import { UserService } from './user.service';

describe('UserService Tests', () => {
  let userService: UserService;
  let userRepository: Repository<User>;
  let userMapper: UserMapper;
  let userValidator: UserCreateValidator;

  beforeEach(async () => {
    const ref: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        UserMapper,
        UserCreateValidator,
        { provide: getRepositoryToken(User), useValue: { save: jest.fn() } },
      ],
    }).compile();

    userService = ref.get<UserService>(UserService);
    userRepository = ref.get<Repository<User>>(getRepositoryToken(User));
    userMapper = ref.get<UserMapper>(UserMapper);
    userValidator = ref.get<UserCreateValidator>(UserCreateValidator);
  });

  describe('create Tests', () => {
    it('creates a user with success', async () => {
      const request: UserCreateRequest = new UserCreateRequest();
      const user: User = new User();
      const response: UserCreateResponse = new UserCreateResponse();

      jest.spyOn(userValidator, 'validateCreateUserRequest').mockImplementationOnce(() => {});
      jest.spyOn(userMapper, 'fromCreateRequestToUser').mockImplementationOnce(() => user);
      jest.spyOn(userRepository, 'save').mockResolvedValueOnce(user);
      jest.spyOn(userMapper, 'fromUserToCreateResponse').mockImplementationOnce(() => response);

      const result: UserCreateResponse = await userService.create(request);

      expect(result).toEqual(response);
      expect(userMapper.fromCreateRequestToUser).toHaveBeenCalled();
      expect(userMapper.fromUserToCreateResponse).toHaveBeenCalled();
      expect(userRepository.save).toHaveBeenCalled();
    });
  });
});
