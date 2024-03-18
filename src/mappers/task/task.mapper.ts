import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import {
  CreateTaskRequestDto,
  CreateTaskResponseDto,
  CreateTaskTimeRequestDto,
  CreateTaskTimeResponseDto,
  GetPaginatedTaskResponseDto,
  TimesDto,
  UpdateTaskRequestDto,
  UpdateTaskResponseDto,
} from '@dtos';
import { Task } from '@entities';
import { TaskAndTime, UpdateTask } from '@interfaces';
import { DATE_TIME_FORMAT } from '@constants';

@Injectable()
export class TaskMapper {
  fromCreateRequestToTask(userId: number, request: CreateTaskRequestDto): Task {
    const task: Task = new Task();

    task.description = request.description;
    task.idUser = userId;
    task.link = request.link;
    task.title = request.title;

    return task;
  }

  fromTaskAndTaskTimeToCreateTaskResponse(
    task: Task,
    taskTime: CreateTaskTimeResponseDto,
  ): CreateTaskResponseDto {
    const response: CreateTaskResponseDto = new CreateTaskResponseDto();
    const times: TimesDto = new TimesDto();

    response.createdAt = task.createdAt;
    response.title = task.title;
    response.link = task.link;
    response.id = task.id;
    response.description = task.description;
    response.updatedAt = task.updatedAt;
    response.totalTimeSpent = taskTime.timeSpent;

    times.createdAt = taskTime.createdAt;
    times.endedAt = taskTime.endedAt;
    times.initiatedAt = taskTime.initiatedAt;
    times.updatedAt = taskTime.updatedAt;
    times.timeSpent = taskTime.timeSpent;

    response.times = new Array(times);

    return response;
  }

  fromTaskUpdateRequestToUpdateTask(request: UpdateTaskRequestDto): UpdateTask {
    const task: UpdateTask = new UpdateTask();

    task.title = request.title;
    task.description = request.description;
    task.link = request.link;
    task.updatedAt = dayjs(new Date()).format(DATE_TIME_FORMAT);

    return task;
  }

  fromTaskToTaskUpdateResponse(task: Task): UpdateTaskResponseDto {
    const response: UpdateTaskResponseDto = new UpdateTaskResponseDto();

    response.createdAt = task.createdAt;
    response.description = task.description;
    response.id = task.id;
    response.link = task.link;
    response.title = task.title;
    response.updatedAt = task.updatedAt;

    return response;
  }

  fromCreateRequestToCreateTaskTimeRequest(
    request: CreateTaskRequestDto,
    taskId: number,
  ): CreateTaskTimeRequestDto {
    const taskTimeRequest: CreateTaskTimeRequestDto = new CreateTaskTimeRequestDto();

    taskTimeRequest.endedAt = request.endedAt;
    taskTimeRequest.initiatedAt = request.initiatedAt;
    taskTimeRequest.taskId = taskId;

    return taskTimeRequest;
  }

  formTasksAndTimesToPaginatedTasksResponse(
    tasksAndTimes: Array<TaskAndTime>,
  ): GetPaginatedTaskResponseDto {
    const response: GetPaginatedTaskResponseDto = new GetPaginatedTaskResponseDto();

    return response;
  }
}
