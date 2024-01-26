import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import { UserCreateRequestDto, UserCreateResponseDto } from '@dtos';
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
}
