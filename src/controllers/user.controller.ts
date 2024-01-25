import { Controller, Post, Body } from '@nestjs/common';
import {
  UserCreateRequestDto,
  UserCreateResponseDto,
  UserLoginRequestDto,
  UserLoginResponseDto,
} from '@dtos';
import { UserService } from '@services';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async createUser(@Body() request: UserCreateRequestDto): Promise<UserCreateResponseDto> {
    return await this.userService.create(request);
  }

  @Post('/login')
  async loginUser(@Body() request: UserLoginRequestDto): Promise<UserLoginResponseDto> {
    return await this.userService.login(request);
  }
}
