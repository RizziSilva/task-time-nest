import { HttpException, HttpStatus } from '@nestjs/common';
import { UPDATE_USER_EXCEPTION_DEFAULT_MESSAGE } from '@constants';

export class UpdateException extends HttpException {
  constructor(message?: string, error?: Error | string) {
    super(message || UPDATE_USER_EXCEPTION_DEFAULT_MESSAGE, HttpStatus.BAD_REQUEST, {
      cause: error || message,
    });
  }
}
