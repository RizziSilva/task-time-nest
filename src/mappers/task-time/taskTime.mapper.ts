import { DATE_TIME_FORMAT } from '@constants';
import { CreateTaskTimeRequestDto, CreateTaskTimeResponseDto } from '@dtos';
import { TaskTime } from '@entities';
import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';

@Injectable()
export class TaskTimeMapper {
  fromCreateTaskTimeToTaskTime(request: CreateTaskTimeRequestDto): TaskTime {
    const taskTime: TaskTime = new TaskTime();

    taskTime.createdAt = dayjs(new Date()).format(DATE_TIME_FORMAT);
    taskTime.taskId = request.taskId;
    taskTime.initiatedAt = dayjs(request.initiatedAt).format(DATE_TIME_FORMAT);
    taskTime.endedAt = dayjs(request.endedAt).format(DATE_TIME_FORMAT);

    return taskTime;
  }

  fromTaskTimeToCreateTaskTimeResponse(taskTime: TaskTime): CreateTaskTimeResponseDto {
    const response: CreateTaskTimeResponseDto = new CreateTaskTimeResponseDto();

    response.createdAt = taskTime.createdAt;
    response.endedAt = taskTime.endedAt;
    response.initiatedAt = taskTime.initiatedAt;
    response.taskId = taskTime.taskId;
    response.updatedAt = taskTime.updatedAt;

    return response;
  }
}
