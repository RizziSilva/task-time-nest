import { HttpException, HttpStatus } from '@nestjs/common';
import { DELETE_TASK_TIME_DEFAULT_MESSAGE } from '@constants';

export class DeleteTaskTimeException extends HttpException {
  constructor(message?: string, error?: Error) {
    super(message || DELETE_TASK_TIME_DEFAULT_MESSAGE, HttpStatus.BAD_REQUEST, {
      cause: error || message,
    });
  }
}
