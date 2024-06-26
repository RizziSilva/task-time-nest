import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import {
  GetUserResponseDto,
  UserCreateRequestDto,
  UserCreateResponseDto,
  UserUpdateResponseDto,
} from '@dtos';
import { User } from '@entities';
import { DATE_TIME_FORMAT } from '@constants';

@Injectable()
export class UserMapper {
  fromCreateRequestToUser(request: UserCreateRequestDto, hashPassword: string): User {
    const user = new User();

    user.name = request.name;
    user.password = hashPassword;
    user.email = request.email;
    user.updatedAt = dayjs(new Date()).format(DATE_TIME_FORMAT);

    return user;
  }

  fromUserToCreateResponse(entity: User): UserCreateResponseDto {
    const response: UserCreateResponseDto = new UserCreateResponseDto();

    response.email = entity.email;
    response.name = entity.name;
    response.id = entity.id;
    response.createdAt = entity.createdAt;
    response.updatedAt = entity.createdAt;

    return response;
  }

  fromUserToUpdateUserResponse(entity: User): UserUpdateResponseDto {
    const response: UserUpdateResponseDto = new UserUpdateResponseDto();

    response.email = entity.email;
    response.name = entity.name;

    return response;
  }

  fromUserToGetUserResponseDto(user: User): GetUserResponseDto {
    const response: GetUserResponseDto = new GetUserResponseDto();

    response.email = user.email;
    response.name = user.name;
    response.createdAt = user.createdAt;
    response.updatedAt = user.updatedAt;

    return response;
  }
}
