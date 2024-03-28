import { HttpException, HttpStatus } from '@nestjs/common';
import { CREATE_USER_EXCEPTION_DEFAULT_MESSAGE } from '@constants';

export class CreateUserException extends HttpException {
  constructor(message?: string, error?: Error | string) {
    super(message || CREATE_USER_EXCEPTION_DEFAULT_MESSAGE, HttpStatus.BAD_REQUEST, {
      cause: error || message,
    });
  }
}
