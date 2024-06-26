import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hash } from 'bcrypt';
import {
  AuthLoginResponseDto,
  GetUserResponseDto,
  UserCreateRequestDto,
  UserCreateResponseDto,
  UserUpdateRequestDto,
  UserUpdateResponseDto,
} from '@dtos';
import { UserMapper } from '@mappers';
import { User } from '@entities';
import { UserValidator } from '@validators';
import { DATE_TIME_FORMAT } from '@constants';
import dayjs from 'dayjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private userValidator: UserValidator,
    private userMapper: UserMapper,
  ) {}

  async create(request: UserCreateRequestDto): Promise<UserCreateResponseDto> {
    this.userValidator.validateCreateUserRequest(request);

    const userPasswordHash: string = await this.createHasFromPassword(request.password);
    const user: User = this.userMapper.fromCreateRequestToUser(request, userPasswordHash);
    const entityResponse: User = await this.userRepository.save(user);
    const response: UserCreateResponseDto =
      this.userMapper.fromUserToCreateResponse(entityResponse);

    return response;
  }

  async update(
    request: UserUpdateRequestDto,
    user: AuthLoginResponseDto,
  ): Promise<UserUpdateResponseDto> {
    this.userValidator.validateUserUpdateRequest(request);

    const updatedUser: User = await this.updateById(user.id, request);
    const response: UserUpdateResponseDto =
      this.userMapper.fromUserToUpdateUserResponse(updatedUser);

    return response;
  }

  async getUser(user: AuthLoginResponseDto): Promise<GetUserResponseDto> {
    const userEntity: User = await this.findOneById(user.id);
    const response: GetUserResponseDto = this.userMapper.fromUserToGetUserResponseDto(userEntity);

    return response;
  }

  async findOneByEmail(email: string): Promise<User> {
    return await this.userRepository.findOneBy({
      email,
    });
  }

  async findOneByRefreshToken(refreshToken: string): Promise<User> {
    return await this.userRepository.findOneBy({
      refreshToken,
    });
  }

  async findOneById(id: number): Promise<User> {
    return await this.userRepository.findOneBy({
      id,
    });
  }

  async updateRefreshToken(id: number, refreshToken: string): Promise<void> {
    await this.userRepository.update({ id }, { refreshToken });
  }

  async updateById(currentId: number, newUser: UserUpdateRequestDto): Promise<User> {
    const { email, name } = newUser;
    const now: string = dayjs(new Date()).format(DATE_TIME_FORMAT);

    await this.userRepository.update({ id: currentId }, { email, name, updatedAt: now });

    const updatedEntity: User = await this.findOneById(currentId);

    return updatedEntity;
  }

  private async createHasFromPassword(password: string): Promise<string> {
    return await hash(password, 10);
  }
}
