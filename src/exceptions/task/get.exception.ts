import { HttpException, HttpStatus } from '@nestjs/common';
import { GET_TASK_MISSING_ID } from '@constants';

export class GetTaskException extends HttpException {
  constructor(message?: string, error?: Error) {
    super(message || GET_TASK_MISSING_ID, HttpStatus.BAD_REQUEST, {
      cause: error || message,
    });
  }
}
