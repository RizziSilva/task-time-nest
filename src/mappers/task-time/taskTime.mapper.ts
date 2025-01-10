import { DATE_TIME_FORMAT, NUMBER_OF_ENTRIES_PER_PAGE } from '@constants';
import {
  CreateTaskTimeRequestDto,
  CreateTaskTimeResponseDto,
  GetPaginatedTaskDto,
  GetPaginatedTaskTimesResponseDto,
  TaskTimeDto,
  UpdateTaskTimeRequestDto,
  UpdateTaskTimeResponseDto,
} from '@dtos';
import { Task, TaskTime } from '@entities';
import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';

@Injectable()
export class TaskTimeMapper {
  fromCreateTaskTimeToTaskTime(
    request: CreateTaskTimeRequestDto,
    timeSpent: number,
    task: Task,
  ): TaskTime {
    const taskTime: TaskTime = new TaskTime();

    taskTime.createdAt = dayjs(new Date()).format(DATE_TIME_FORMAT);
    taskTime.initiatedAt = dayjs(request.initiatedAt).format(DATE_TIME_FORMAT);
    taskTime.endedAt = dayjs(request.endedAt).format(DATE_TIME_FORMAT);
    taskTime.task = task;
    taskTime.timeSpent = timeSpent;

    return taskTime;
  }

  fromTaskTimeToCreateTaskTimeResponse(taskTime: TaskTime): CreateTaskTimeResponseDto {
    const response: CreateTaskTimeResponseDto = new CreateTaskTimeResponseDto();

    response.createdAt = taskTime.createdAt;
    response.endedAt = taskTime.endedAt;
    response.initiatedAt = taskTime.initiatedAt;
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
    response.timeSpent = taskTime.timeSpent;
    response.initiatedAt = taskTime.initiatedAt;
    response.endedAt = taskTime.endedAt;

    return response;
  }

  fromTaskTimesToGetPaginatedTaskTimesResponse(
    taskTimes: Array<TaskTime>,
    userNumberOfTaskTimes: number,
    page: number,
  ): GetPaginatedTaskTimesResponseDto {
    const response: GetPaginatedTaskTimesResponseDto = new GetPaginatedTaskTimesResponseDto();
    const totalTasksReturned: number = page * NUMBER_OF_ENTRIES_PER_PAGE;

    response.taskTimes = this.fromTaskTimesToTaskTimeDto(taskTimes);
    response.page = page;
    response.isLastPage = totalTasksReturned >= userNumberOfTaskTimes;

    return response;
  }

  private fromTaskTimesToTaskTimeDto(taskTimes: Array<TaskTime>): Array<TaskTimeDto> {
    return taskTimes.map((taskTime: TaskTime) => {
      const taskTimeDto: TaskTimeDto = new TaskTimeDto();

      taskTimeDto.endedAt = taskTime.endedAt;
      taskTimeDto.initiatedAt = taskTime.initiatedAt;
      taskTimeDto.totalTimeSpent = taskTime.timeSpent;
      taskTimeDto.id = taskTime.id;
      taskTimeDto.task = this.fromTaskToGetPaginatedTaskDto(taskTime.task);

      return taskTimeDto;
    });
  }

  private fromTaskToGetPaginatedTaskDto(task: Task): GetPaginatedTaskDto {
    const getPaginatedTaskDto: GetPaginatedTaskDto = new GetPaginatedTaskDto();

    getPaginatedTaskDto.description = task.description;
    getPaginatedTaskDto.link = task.link;
    getPaginatedTaskDto.title = task.title;
    getPaginatedTaskDto.id = task.id;

    return getPaginatedTaskDto;
  }
}
