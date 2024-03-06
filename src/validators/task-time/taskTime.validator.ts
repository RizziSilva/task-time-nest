import { Injectable } from '@nestjs/common';
import { CREATE_TASK_TIME_MISSING_TASK_ID } from '@constants';
import { CreateTaskTimeRequestDto } from '@dtos';
import { CreateTaskTimeException } from '@exceptions';

@Injectable()
export class TaskTimeValidator {
  validateTaskTimeCreateRequest(request: CreateTaskTimeRequestDto) {
    const { taskId } = request;

    if (!taskId) throw new CreateTaskTimeException(CREATE_TASK_TIME_MISSING_TASK_ID);
  }
}
