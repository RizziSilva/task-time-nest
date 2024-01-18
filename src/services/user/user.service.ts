import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserCreateRequest, UserCreateResponse } from '@dtos';
import { UserMapper } from '@mappers';
import { User } from '@entities';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private userMapper: UserMapper,
  ) {}

  async create(request: UserCreateRequest): Promise<UserCreateResponse> {
    const user: User = this.userMapper.fromCreateRequestToUser(request);
    const entityResponse: User = await this.userRepository.save(user);
    const response: UserCreateResponse = this.userMapper.fromUserToCreateResponse(entityResponse);

    return response;
  }
}
