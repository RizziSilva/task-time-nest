import { Injectable } from '@nestjs/common';
import { CreateTaskRequestDto, UpdateTaskRequestDto } from '@dtos';
import { CreateTaskException, UpdateTaskException } from '@exceptions';
import {
  CREATE_TASK_EXCEPTION_MISSING_ENDED,
  CREATE_TASK_EXCEPTION_MISSING_INITIATED,
  CREATE_TASK_EXCEPTION_TIMES_RELATION,
  UPDATE_TASK_EXCEPTION_MISSING_TASK_ID,
} from '@constants';

@Injectable()
export class TaskValidator {
  validateCreateTaskRequest(request: CreateTaskRequestDto): void {
    const { initiatedAt, endedAt } = request;

    if (!initiatedAt) throw new CreateTaskException(CREATE_TASK_EXCEPTION_MISSING_INITIATED);

    if (!endedAt) throw new CreateTaskException(CREATE_TASK_EXCEPTION_MISSING_ENDED);

    const initiatedAsData: Date = new Date(initiatedAt);
    const endedAsData: Date = new Date(endedAt);
    const isInitialOlder: boolean = initiatedAsData < endedAsData;

    if (!isInitialOlder) throw new CreateTaskException(CREATE_TASK_EXCEPTION_TIMES_RELATION);
  }

  validateUpdateTaskRequest(taskId: number): void {
    if (!taskId) throw new UpdateTaskException(UPDATE_TASK_EXCEPTION_MISSING_TASK_ID);
  }
}
