import { HttpException, HttpStatus } from '@nestjs/common';
import { UPDATE_EXCEPTION_DEFAULT_MESSAGE } from '@constants';

export class UpdateException extends HttpException {
  constructor(message?: string) {
    super(
      { status: HttpStatus.BAD_REQUEST, error: message || UPDATE_EXCEPTION_DEFAULT_MESSAGE },
      HttpStatus.BAD_REQUEST,
    );
  }
}
