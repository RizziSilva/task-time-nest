import { HttpException, HttpStatus } from '@nestjs/common';
import { CREATE_USER_EXCEPTION_DEFAULT_MESSAGE } from '@constants';

export class CreateUserException extends HttpException {
  constructor(message?: string) {
    super(
      { status: HttpStatus.BAD_REQUEST, error: message || CREATE_USER_EXCEPTION_DEFAULT_MESSAGE },
      HttpStatus.BAD_REQUEST,
    );
  }
}
