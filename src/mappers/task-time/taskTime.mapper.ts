import { DATE_TIME_FORMAT } from '@constants';
import {
  CreateTaskTimeRequestDto,
  CreateTaskTimeResponseDto,
  UpdateTaskTimeRequestDto,
  UpdateTaskTimeResponseDto,
} from '@dtos';
import { TaskTime } from '@entities';
import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';

@Injectable()
export class TaskTimeMapper {
  fromCreateTaskTimeToTaskTime(request: CreateTaskTimeRequestDto, timeSpent: number): TaskTime {
    const taskTime: TaskTime = new TaskTime();

    taskTime.createdAt = dayjs(new Date()).format(DATE_TIME_FORMAT);
    taskTime.taskId = request.taskId;
    taskTime.initiatedAt = dayjs(request.initiatedAt).format(DATE_TIME_FORMAT);
    taskTime.endedAt = dayjs(request.endedAt).format(DATE_TIME_FORMAT);
    taskTime.timeSpent = timeSpent;

    return taskTime;
  }

  fromTaskTimeToCreateTaskTimeResponse(taskTime: TaskTime): CreateTaskTimeResponseDto {
    const response: CreateTaskTimeResponseDto = new CreateTaskTimeResponseDto();

    response.createdAt = taskTime.createdAt;
    response.endedAt = taskTime.endedAt;
    response.initiatedAt = taskTime.initiatedAt;
    response.taskId = taskTime.taskId;
    response.updatedAt = taskTime.updatedAt;
    response.timeSpent = taskTime.timeSpent;

    return response;
  }

  fromUpdateTaskTimeRequestToTaskTime(
    request: UpdateTaskTimeRequestDto,
    timeSpent: number,
  ): TaskTime {
    const taskTime: TaskTime = new TaskTime();

    taskTime.timeSpent = timeSpent;
    taskTime.initiatedAt = request.initiatedAt;
    taskTime.endedAt = request.endedAt;
    taskTime.updatedAt = dayjs(Date()).format(DATE_TIME_FORMAT);

    return taskTime;
  }

  fromTaskTimeToUpdateTaskTimeResponse(taskTime: TaskTime): UpdateTaskTimeResponseDto {
    const response: UpdateTaskTimeResponseDto = new UpdateTaskTimeResponseDto();

    response.createdAt = taskTime.createdAt;
    response.updatedAt = taskTime.updatedAt;
    response.id = taskTime.id;
    response.taskId = taskTime.taskId;
    response.timeSpent = taskTime.timeSpent;
    response.initiatedAt = taskTime.initiatedAt;
    response.endedAt = taskTime.endedAt;

    return response;
  }
}
