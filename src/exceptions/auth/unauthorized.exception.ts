import { HttpException, HttpStatus } from '@nestjs/common';
import { UNAUTHORIZED_ACTION } from '@constants';

export class UnauthorizedException extends HttpException {
  constructor() {
    super({ status: HttpStatus.UNAUTHORIZED, error: UNAUTHORIZED_ACTION }, HttpStatus.UNAUTHORIZED);
  }
}
