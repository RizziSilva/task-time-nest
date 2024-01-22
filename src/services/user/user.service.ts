import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserCreateRequest, UserCreateResponse } from '@dtos';
import { UserMapper } from '@mappers';
import { User } from '@entities';
import { UserCreateValidator } from '@validators';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private userValidator: UserCreateValidator,
    private userMapper: UserMapper,
  ) {}

  async create(request: UserCreateRequest): Promise<UserCreateResponse> {
    this.userValidator.validateCreateUserRequest(request);
    const user: User = this.userMapper.fromCreateRequestToUser(request);
    const entityResponse: User = await this.userRepository.save(user);
    const response: UserCreateResponse = this.userMapper.fromUserToCreateResponse(entityResponse);

    return response;
  }
}
