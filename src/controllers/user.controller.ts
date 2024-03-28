import { Controller, Post, Body, Put, HttpStatus, HttpCode, UseGuards, Get } from '@nestjs/common';
import {
  AuthLoginResponseDto,
  GetUserResponseDto,
  UserCreateRequestDto,
  UserCreateResponseDto,
} from '@dtos';
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
  @HttpCode(HttpStatus.OK)
  @Put()
  async updateUser(
    @RequestUser() user: AuthLoginResponseDto,
    @Body() request: UserUpdateRequestDto,
  ): Promise<UserUpdateResponseDto> {
    return await this.userService.update(request, user);
  }

  @UseGuards(UserJwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get()
  async getUser(@RequestUser() user: AuthLoginResponseDto): Promise<GetUserResponseDto> {
    return await this.userService.getUser(user);
  }
}
