import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hash, compare } from 'bcrypt';
import {
  UserCreateRequestDto,
  UserCreateResponseDto,
  UserLoginRequestDto,
  UserLoginResponseDto,
} from '@dtos';
import { UserMapper } from '@mappers';
import { User } from '@entities';
import { UserCreateValidator } from '@validators';
import { UNAUTHORIZED_LOGIN } from '@constants';

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

  async login(request: UserLoginRequestDto): Promise<UserLoginResponseDto> {
    const user: User = await this.findOneByEmail(request.email);

    if (!user) {
      throw new HttpException(
        { status: HttpStatus.UNAUTHORIZED, error: UNAUTHORIZED_LOGIN },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const isCorrectUserPassword: boolean = await this.comparePasswords(
      user.password,
      request.password,
    );

    if (!isCorrectUserPassword) {
      throw new HttpException(
        { status: HttpStatus.UNAUTHORIZED, error: UNAUTHORIZED_LOGIN },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const response: UserLoginResponseDto = this.userMapper.fromUserToLoginResponse(user);

    return response;
  }

  private async findOneByEmail(email: string): Promise<User> {
    return await this.userRepository.findOneBy({
      email: email,
    });
  }

  private async createHasFromPassword(password: string): Promise<string> {
    return await hash(password, 10);
  }

  private async comparePasswords(userPassword: string, requestPassword: string): Promise<boolean> {
    return await compare(requestPassword, userPassword);
  }
}
