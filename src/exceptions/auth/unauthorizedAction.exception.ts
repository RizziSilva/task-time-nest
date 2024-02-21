import { HttpException, HttpStatus } from '@nestjs/common';
import { UNAUTHORIZED_ACTION } from '@constants';

export class UnauthorizedActionException extends HttpException {
  constructor(error: Error | string) {
    super(UNAUTHORIZED_ACTION, HttpStatus.UNAUTHORIZED, {
      cause: error,
    });
  }
}
