import { HttpException, HttpStatus } from '@nestjs/common';
import { UPDATE_TASK_EXCEPTION_DEFAULT_MESSAGE } from '@constants';

export class UpdateTaskException extends HttpException {
  constructor(message?: string, error?: Error) {
    super(message || UPDATE_TASK_EXCEPTION_DEFAULT_MESSAGE, HttpStatus.BAD_REQUEST, {
      cause: error || message,
    });
  }
}
