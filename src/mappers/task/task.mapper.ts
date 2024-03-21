import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import {
  CreateTaskRequestDto,
  CreateTaskResponseDto,
  CreateTaskTimeRequestDto,
  CreateTaskTimeResponseDto,
  GetPaginatedTaskResponseDto,
  GetPaginatedTimesDto,
  GetTaskResponseDto,
  GetTaskTimes,
  TasksDto,
  TimesDto,
  UpdateTaskRequestDto,
  UpdateTaskResponseDto,
} from '@dtos';
import { Task } from '@entities';
import { GetTask, TaskAndTime, UpdateTask } from '@interfaces';
import { DATE_TIME_FORMAT, NUMBER_OF_ENTRIES_PER_PAGE } from '@constants';

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
    page: number,
    userNumberOfTasks: number,
  ): GetPaginatedTaskResponseDto {
    const response: GetPaginatedTaskResponseDto = new GetPaginatedTaskResponseDto();
    const responseTasks: Array<TasksDto> = new Array<TasksDto>();

    tasksAndTimes.forEach((task) => {
      const alreadyBuiltTasksDto: TasksDto = responseTasks.find(
        (element) => element.id === task.taskId,
      );
      const hasFindedTask: boolean = !!alreadyBuiltTasksDto;
      const currentTask: TasksDto = hasFindedTask
        ? alreadyBuiltTasksDto
        : this.fromTaskAndTimesToTasksDto(task);
      const getPaginatedTimes: GetPaginatedTimesDto =
        this.fromTaskAndTimesToGetPaginatedTimesDto(task);

      currentTask.times.push(getPaginatedTimes);
      currentTask.totalTimeSpent += getPaginatedTimes.totalTimeSpent;

      if (!hasFindedTask) responseTasks.push(currentTask);
    });

    const totalTasksReturned: number = page * NUMBER_OF_ENTRIES_PER_PAGE;

    response.page = page;
    response.isLastPage = totalTasksReturned >= userNumberOfTasks;
    response.tasks = responseTasks;

    return response;
  }

  fromTaskToGetTaskResponse(tasks: Array<GetTask>): GetTaskResponseDto {
    const response: GetTaskResponseDto = new GetTaskResponseDto();

    tasks.forEach((task, index) => {
      const isFirstInteraction: boolean = index === 0;

      if (isFirstInteraction) {
        response.createdAt = task.createdAt;
        response.description = task.description;
        response.id = task.taskId;
        response.idUser = task.idUser;
        response.link = task.link;
        response.title = task.title;
        response.updatedAt = task.updatedAt;
      }

      response.totalTimeSpent += task.timeSpent;

      const time: GetTaskTimes = new GetTaskTimes();

      time.totalTimeSpent = task.timeSpent;
      time.id = task.taskTimeId;
      time.endedAt = task.endedAt;
      time.initiatedAt = task.initiatedAt;

      response.times.push(time);
    });

    return response;
  }

  private fromTaskAndTimesToGetPaginatedTimesDto(taskAndTimes: TaskAndTime): GetPaginatedTimesDto {
    const response: GetPaginatedTimesDto = new GetPaginatedTimesDto();

    response.endedAt = taskAndTimes.endedAt;
    response.initiatedAt = taskAndTimes.initiatedAt;
    response.totalTimeSpent = taskAndTimes.timeSpent;

    return response;
  }

  private fromTaskAndTimesToTasksDto(taskAndTimes: TaskAndTime): TasksDto {
    const response: TasksDto = new TasksDto();

    response.description = taskAndTimes.description;
    response.link = taskAndTimes.link;
    response.title = taskAndTimes.title;
    response.id = taskAndTimes.taskId;

    return response;
  }
}
