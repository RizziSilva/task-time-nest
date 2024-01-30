import { Controller, Post, Body } from '@nestjs/common';
import { UserCreateRequestDto, UserCreateResponseDto } from '@dtos';
import { UserService } from '@services';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async createUser(@Body() request: UserCreateRequestDto): Promise<UserCreateResponseDto> {
    return await this.userService.create(request);
  }
}
