import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hash, compare } from 'bcrypt';
import { UserCreateRequestDto, UserCreateResponseDto } from '@dtos';
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

  async create(request: UserCreateRequestDto): Promise<UserCreateResponseDto> {
    this.userValidator.validateCreateUserRequest(request);
    const userPasswordHash: string = await this.createHasFromPassword(request.password);
    const user: User = this.userMapper.fromCreateRequestToUser(request, userPasswordHash);
    const entityResponse: User = await this.userRepository.save(user);
    const response: UserCreateResponseDto =
      this.userMapper.fromUserToCreateResponse(entityResponse);

    return response;
  }

  async findOneByEmail(email: string): Promise<User> {
    return await this.userRepository.findOneBy({
      email: email,
    });
  }

  private async createHasFromPassword(password: string): Promise<string> {
    return await hash(password, 10);
  }
}
