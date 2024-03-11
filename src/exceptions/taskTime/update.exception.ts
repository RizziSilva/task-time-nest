import { HttpException, HttpStatus } from '@nestjs/common';
import { UPDATE_TASK_TIME_DEFAULT_MESSAGE } from '@constants';

export class UpdateTaskTimeException extends HttpException {
  constructor(message: string, error?: Error) {
    super(message || UPDATE_TASK_TIME_DEFAULT_MESSAGE, HttpStatus.BAD_REQUEST, {
      cause: error || message,
    });
  }
}
