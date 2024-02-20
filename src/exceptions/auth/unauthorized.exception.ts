import { HttpException, HttpStatus } from '@nestjs/common';
import { UNAUTHORIZED_LOGIN } from '@constants';

export class UnauthorizedException extends HttpException {
  constructor() {
    super({ status: HttpStatus.UNAUTHORIZED, error: UNAUTHORIZED_LOGIN }, HttpStatus.UNAUTHORIZED);
  }
}
