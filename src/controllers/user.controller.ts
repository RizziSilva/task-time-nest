import { Controller, Post, Body } from '@nestjs/common';
import { UserCreateRequest, UserCreateResponse } from '@dtos';
import { UserService } from '@services';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async createUser(@Body() request: UserCreateRequest): Promise<UserCreateResponse> {
    return await this.userService.create(request);
  }
}
