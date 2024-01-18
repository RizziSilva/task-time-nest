import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import { UserCreateRequest, UserCreateResponse } from '@dtos';
import { User } from '@entities';

@Injectable()
export class UserMapper {
  fromCreateRequestToUser(request: UserCreateRequest): User {
    const user = new User();

    user.name = request.name;
    user.password = request.password;
    user.email = request.email;
    user.updated_at = dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss');

    return user;
  }

  fromUserToCreateResponse(entity: User): UserCreateResponse {
    const response: UserCreateResponse = new UserCreateResponse();

    response.email = entity.email;
    response.name = entity.name;
    response.id = entity.id;
    response.created_at = entity.created_at;
    response.updated_at = entity.created_at;

    return response;
  }
}
