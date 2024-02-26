import { HttpException, HttpStatus } from '@nestjs/common';
import { UNAUTHORIZED_LOGIN } from '@constants';

export class UnauthorizedException extends HttpException {
  constructor(error: Error | string) {
    super(UNAUTHORIZED_LOGIN, HttpStatus.UNAUTHORIZED, {
      cause: error,
    });
  }
}
