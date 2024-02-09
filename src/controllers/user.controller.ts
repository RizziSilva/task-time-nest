import { Controller, Post, Body, Put, HttpStatus, HttpCode, UseGuards } from '@nestjs/common';
import { AuthLoginResponseDto, UserCreateRequestDto, UserCreateResponseDto } from '@dtos';
import { UserService } from '@services';
import { UserUpdateRequestDto, UserUpdateResponseDto } from '@dtos';
import { RequestUser } from '@decorators';
import { UserJwtAuthGuard } from '@guards';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async createUser(@Body() request: UserCreateRequestDto): Promise<UserCreateResponseDto> {
    return await this.userService.create(request);
  }

  @UseGuards(UserJwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @Put()
  async updateUser(
    @RequestUser() user: AuthLoginResponseDto,
    @Body() request: UserUpdateRequestDto,
  ): Promise<UserUpdateResponseDto> {
    console.log('user', user);
    console.log('request', request);

    return await this.userService.update(request, user);
  }
}
