import { HttpException, HttpStatus } from '@nestjs/common';
import { CREATE_TASK_TIME_EXCEPTION_DEFAULT_MESSAGE } from '@constants';

export class CreateTaskTimeException extends HttpException {
  constructor(message?: string, error?: Error) {
    super(message || CREATE_TASK_TIME_EXCEPTION_DEFAULT_MESSAGE, HttpStatus.BAD_REQUEST, {
      cause: error || message,
    });
  }
}
