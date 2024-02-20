import dayjs from 'dayjs';
import { UserCreateRequestDto, UserCreateResponseDto, UserUpdateResponseDto } from '@dtos';
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

  describe('fromCreateRequestToUser Tests', () => {
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

  describe('fromUserToCreateResponse Tests', () => {
    it('Convert user entity to create user response', () => {
      const randomInt: number = Math.random();
      const dateMock: string = dayjs(new Date()).format(DATE_TIME_FORMAT);

      const user: User = new User();
      user.createdAt = dateMock;
      user.email = 'some@email.com';
      user.name = 'Some Name';
      user.updatedAt = dateMock;
      user.id = randomInt;

      const expected: UserCreateResponseDto = userMapper.fromUserToCreateResponse(user);

      expect(expected).toEqual(user);
    });
  });

  describe('fromUserToUpdateUserResponse Tests', () => {
    it('Convert user entity to update response', () => {
      const user: User = new User();
      user.email = 'valid.email@email.com';
      user.name = 'Valid Name';

      const expected: UserUpdateResponseDto = userMapper.fromUserToUpdateUserResponse(user);

      expect(expected).toEqual(user);
    });
  });
});
