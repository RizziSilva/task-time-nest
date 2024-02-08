import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hash } from 'bcrypt';
import {
  AuthLoginResponseDto,
  UserCreateRequestDto,
  UserCreateResponseDto,
  UserUpdateRequestDto,
  UserUpdateResponseDto,
} from '@dtos';
import { UserMapper } from '@mappers';
import { User } from '@entities';
import { UserValidator } from '@validators';
import { UpdateException } from '@exceptions';

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
    try {
      this.userValidator.validateUserUpdateRequest(request);

      const updatedUser: User = await this.updateByEmail(user.email, request);
      const response: UserUpdateResponseDto =
        this.userMapper.fromUserToUpdateUserResponse(updatedUser);

      return response;
    } catch (error) {
      console.log(error);
      throw new UpdateException();
    }
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

  async updateRefreshToken(email: string, refreshToken: string): Promise<void> {
    await this.userRepository.update({ email }, { refreshToken });
  }

  async updateByEmail(currentUserEmail: string, newUser: UserUpdateRequestDto): Promise<User> {
    const { email, name } = newUser;

    return (await this.userRepository.update({ email: currentUserEmail }, { email, name })).raw[0];
  }

  private async createHasFromPassword(password: string): Promise<string> {
    return await hash(password, 10);
  }
}
