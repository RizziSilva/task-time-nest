import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import { UserValidator } from '@validators';
import { User } from '@entities';
import { UserMapper } from '@mappers';
import { UserController } from '@controllers';
import { UserCreateRequestDto, UserCreateResponseDto } from '@dtos';
import { UserService } from './user.service';

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
        { provide: getRepositoryToken(User), useValue: { save: jest.fn() } },
      ],
    }).compile();

    userService = ref.get<UserService>(UserService);
    userRepository = ref.get<Repository<User>>(getRepositoryToken(User));
    userMapper = ref.get<UserMapper>(UserMapper);
    userValidator = ref.get<UserValidator>(UserValidator);
  });

  describe('create Tests', () => {
    it('creates a user with success', async () => {
      const request: UserCreateRequestDto = new UserCreateRequestDto();
      const user: User = new User();
      const response: UserCreateResponseDto = new UserCreateResponseDto();

      jest.spyOn(userValidator, 'validateCreateUserRequest').mockImplementationOnce(() => {});
      jest.spyOn(userMapper, 'fromCreateRequestToUser').mockImplementationOnce(() => user);
      jest.spyOn(userRepository, 'save').mockResolvedValueOnce(user);
      jest.spyOn(userMapper, 'fromUserToCreateResponse').mockImplementationOnce(() => response);
      jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => Promise.resolve(''));

      const result: UserCreateResponseDto = await userService.create(request);

      expect(result).toEqual(response);
      expect(userMapper.fromCreateRequestToUser).toHaveBeenCalled();
      expect(userMapper.fromUserToCreateResponse).toHaveBeenCalled();
      expect(userRepository.save).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalled();
    });
  });
});
