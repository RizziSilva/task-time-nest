import dayjs from 'dayjs';
import { UserCreateRequestDto, UserCreateResponseDto } from '@dtos';
import { User } from '@entities';
import { DATE_TIME_FORMAT } from '@constants';
import { UserMapper } from './user.mapper';

describe('UserMapper Test', () => {
  let userMapper: UserMapper;

  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(new Date());
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    userMapper = new UserMapper();
  });

  describe('fromCreateRequestToUser', () => {
    it('Convert user create request to user entity', () => {
      const request: UserCreateRequestDto = new UserCreateRequestDto();
      request.email = 'some@email.com';
      request.password = 'some@Pass123';
      request.name = 'Some Name';

      const expected: User = new User();
      expected.email = request.email;
      expected.name = request.name;
      expected.password = request.password;
      expected.updatedAt = dayjs(new Date()).format(DATE_TIME_FORMAT);

      expect(userMapper.fromCreateRequestToUser(request, request.password)).toEqual(expected);
    });
  });

  describe('fromUserToCreateResponse', () => {
    it('Convert user entity to create user response', () => {
      const randomInt: number = Math.random();
      const dateMock: string = dayjs(new Date()).format(DATE_TIME_FORMAT);

      const user: User = new User();
      user.createdAt = dateMock;
      user.email = 'some@email.com';
      user.password = 'some@Pass123';
      user.name = 'Some Name';
      user.updatedAt = dateMock;
      user.id = randomInt;

      const expected: UserCreateResponseDto = new UserCreateResponseDto();
      expected.email = user.email;
      expected.name = user.name;
      expected.id = user.id;
      expected.createdAt = user.createdAt;
      expected.updatedAt = user.createdAt;

      expect(userMapper.fromUserToCreateResponse(user)).toEqual(expected);
    });
  });
});
