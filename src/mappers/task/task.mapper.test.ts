import {
  CreateTaskRequestDto,
  CreateTaskResponseDto,
  CreateTaskTimeResponseDto,
  GetTaskResponseDto,
  GetTimesDto,
  TimesDto,
  UpdateTaskRequestDto,
  UpdateTaskResponseDto,
} from '@dtos';
import { TaskMapper } from './task.mapper';
import { Task, TaskTime } from '@entities';
import { TaskAndTime, UpdateTask } from '@interfaces';
import dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from '@constants';

describe('TaskMapper tests', () => {
  let taskMapper: TaskMapper;

  beforeEach(() => {
    taskMapper = new TaskMapper();
  });

  describe('fromCreateRequestToTask tests', () => {
    it('Convert request to task', () => {
      const request: CreateTaskRequestDto = new CreateTaskRequestDto();
      request.title = 'Title';
      request.description = 'Task description';
      request.link = 'Task link';

      const userId: number = 1;

      const expected: Task = new Task();
      expected.title = 'Title';
      expected.description = 'Task description';
      expected.link = 'Task link';
      expected.idUser = userId;

      const result: Task = taskMapper.fromCreateRequestToTask(userId, request);

      expect(result).toEqual(expected);
    });
  });

  describe('fromTaskToCreateTaskResponse tests', () => {
    it('Convert task to response', () => {
      const timeSpent: number = 1234;

      const task: Task = new Task();
      task.title = 'Task title';
      task.description = 'Task description';
      task.link = 'Task link';

      const taskTimeResponse: CreateTaskTimeResponseDto = new CreateTaskTimeResponseDto();
      taskTimeResponse.timeSpent = timeSpent;
      taskTimeResponse.taskId = 1;

      const times: TimesDto = new TimesDto();
      times.timeSpent = timeSpent;

      const expected: CreateTaskResponseDto = new CreateTaskResponseDto();
      expected.times = new Array(times);
      expected.title = task.title;
      expected.description = task.description;
      expected.link = task.link;
      expected.totalTimeSpent = timeSpent;

      const result: CreateTaskResponseDto = taskMapper.fromTaskAndTaskTimeToCreateTaskResponse(
        task,
        taskTimeResponse,
      );

      expect(result).toEqual(expected);
    });
  });

  describe('fromTaskUpdateRequestToUpdateTask', () => {
    it('Convert task update request to update task interface', () => {
      const request: UpdateTaskRequestDto = new UpdateTaskRequestDto();
      request.title = 'Task title';
      request.description = 'Task description';
      request.link = 'Task link';

      const updatedAt: string = dayjs(new Date()).format(DATE_TIME_FORMAT);

      const result: UpdateTask = taskMapper.fromTaskUpdateRequestToUpdateTask(request);

      expect(result).toEqual({ ...request, updatedAt });
    });
  });

  describe('fromTaskToTaskUpdateResponse', () => {
    it('Convert task to task update response', () => {
      const task: Task = new Task();

      task.title = 'Task title';
      task.description = 'Task description';
      task.link = 'Task link';

      const expected: UpdateTaskResponseDto = new UpdateTaskResponseDto();

      expected.createdAt = task.createdAt;
      expected.description = task.description;
      expected.id = task.id;
      expected.link = task.link;
      expected.title = task.title;
      expected.updatedAt = task.updatedAt;

      const result: UpdateTaskResponseDto = taskMapper.fromTaskToTaskUpdateResponse(task);

      expect(result).toEqual(expected);
    });
  });

  describe('fromTaskToGetTaskResponseDto', () => {
    it('Convert task to GetTaskResponseDto', () => {
      const task: Task = new Task();
      const taskTime: TaskTime = new TaskTime();

      task.times = [taskTime];

      const expected: GetTaskResponseDto = new GetTaskResponseDto();

      expected.createdAt = task.createdAt;
      expected.description = task.description;
      expected.id = task.id;
      expected.idUser = task.idUser;
      expected.link = task.link;
      expected.title = task.title;
      expected.updatedAt = task.updatedAt;

      const time: GetTimesDto = new GetTimesDto();
      const times: Array<GetTimesDto> = [time];

      expected.times = times;

      const result: GetTaskResponseDto = taskMapper.fromTaskToGetTaskResponseDto(task);

      expect(result).toEqual(expected);
    });
  });
});
