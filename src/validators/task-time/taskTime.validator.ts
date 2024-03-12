import { Injectable } from '@nestjs/common';
import {
  CREATE_TASK_TIME_MISSING_TASK_ID,
  UPDATE_TASK_TIME_MISSING_ENDED,
  UPDATE_TASK_TIME_MISSING_INITIATED,
  UPDATE_TASK_TIME_MISSING_TASK_TIME_ID,
  UPDATE_TASK_TIME_TIMES_RELATION,
} from '@constants';
import { CreateTaskTimeRequestDto, UpdateTaskTimeRequestDto } from '@dtos';
import { CreateTaskTimeException, UpdateTaskTimeException } from '@exceptions';
import { TaskTime } from '@entities';

@Injectable()
export class TaskTimeValidator {
  validateTaskTimeCreateRequest(request: CreateTaskTimeRequestDto): void {
    const { taskId } = request;

    if (!taskId) throw new CreateTaskTimeException(CREATE_TASK_TIME_MISSING_TASK_ID);
  }

  validateTaskTimeUpdateRequest(request: UpdateTaskTimeRequestDto, taskTimeId: number): void {
    const { initiatedAt, endedAt } = request;

    if (!taskTimeId) throw new UpdateTaskTimeException(UPDATE_TASK_TIME_MISSING_TASK_TIME_ID);

    if (!initiatedAt) throw new UpdateTaskTimeException(UPDATE_TASK_TIME_MISSING_INITIATED);

    if (!endedAt) throw new UpdateTaskTimeException(UPDATE_TASK_TIME_MISSING_ENDED);

    const initiatedAsData: Date = new Date(initiatedAt);
    const endedAsData: Date = new Date(endedAt);
    const isInitialOlder: boolean = initiatedAsData < endedAsData;

    if (!isInitialOlder) throw new UpdateTaskTimeException(UPDATE_TASK_TIME_TIMES_RELATION);
  }
}
