import dayjs from 'dayjs';
import {
  CreateTaskTimeRequestDto,
  CreateTaskTimeResponseDto,
  GetPaginatedTaskTimesResponseDto,
  TaskTimeDto,
  UpdateTaskTimeRequestDto,
  UpdateTaskTimeResponseDto,
} from '@dtos';
import { Task, TaskTime } from '@entities';
import { DATE_TIME_FORMAT } from '@constants';
import { TaskTimeMapper } from './taskTime.mapper';

describe('TaskTime mapper tests', () => {
  const taskTimeMapper = new TaskTimeMapper();

  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(new Date());
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe('fromCreateTaskTimeToTaskTime tests', () => {
    it('Converts a create task time request to task time', () => {
      const request: CreateTaskTimeRequestDto = new CreateTaskTimeRequestDto();
      request.taskId = 1;
      request.initiatedAt = '2024-02-26 10:30:18';
      request.endedAt = '2024-02-26 12:00:00';

      const task: Task = new Task();
      const timeSpent: number = 1234;
      const expected: TaskTime = new TaskTime();

      expected.initiatedAt = request.initiatedAt;
      expected.endedAt = request.endedAt;
      expected.timeSpent = timeSpent;
      expected.createdAt = dayjs(new Date()).format(DATE_TIME_FORMAT);
      expected.task = task;

      const result: TaskTime = taskTimeMapper.fromCreateTaskTimeToTaskTime(
        request,
        timeSpent,
        task,
      );

      expect(result).toEqual(expected);
    });
  });

  describe('fromTaskTimeToCreateTaskTimeResponse tests', () => {
    it('Converts task time to create task time response', () => {
      const task: Task = new Task();
      const taskTime: TaskTime = new TaskTime();

      task.id = 1;

      taskTime.timeSpent = 1234;
      taskTime.initiatedAt = '2024-02-26 10:30:18';
      taskTime.endedAt = '2024-02-26 12:00:00';
      taskTime.task = task;

      const expected: CreateTaskTimeResponseDto = {
        createdAt: taskTime.createdAt,
        endedAt: taskTime.endedAt,
        id: taskTime.id,
        initiatedAt: taskTime.initiatedAt,
        taskId: taskTime.task.id,
        timeSpent: taskTime.timeSpent,
        updatedAt: taskTime.updatedAt,
      };

      const result: CreateTaskTimeResponseDto =
        taskTimeMapper.fromTaskTimeToCreateTaskTimeResponse(taskTime);

      expect(result).toEqual(expected);
    });
  });

  describe('fromUpdateTaskTimeRequestToTaskTime tests', () => {
    it('Converts update task time request to task time', () => {
      const timeSpent: number = 123;
      const request: UpdateTaskTimeRequestDto = new UpdateTaskTimeRequestDto();

      request.endedAt = '2024-02-26 12:00:00';
      request.initiatedAt = '2024-02-26 10:30:18';

      const expected: TaskTime = new TaskTime();

      expected.endedAt = request.endedAt;
      expected.initiatedAt = request.initiatedAt;
      expected.timeSpent = timeSpent;
      expected.updatedAt = dayjs(new Date()).format(DATE_TIME_FORMAT);

      const result: TaskTime = taskTimeMapper.fromUpdateTaskTimeRequestToTaskTime(
        request,
        timeSpent,
      );

      expect(result).toEqual(expected);
    });
  });

  describe('fromTaskTimeToUpdateTaskTimeResponse tests', () => {
    it('Converts task time to update task time response', () => {
      const taskTime: TaskTime = new TaskTime();

      taskTime.timeSpent = 123;
      taskTime.initiatedAt = '2024-02-26 10:30:18';
      taskTime.endedAt = '2024-02-26 12:00:00';
      taskTime.updatedAt = dayjs(new Date()).format(DATE_TIME_FORMAT);
      taskTime.id = 123;

      const result: UpdateTaskTimeResponseDto =
        taskTimeMapper.fromTaskTimeToUpdateTaskTimeResponse(taskTime);

      expect(result).toEqual(taskTime);
    });
  });

  describe('fromTaskTimesToGetPaginatedTaskTimesResponse tests', () => {
    it('Converts task times to paginated task time response', () => {
      const task: Task = new Task();
      const taskTime: TaskTime = new TaskTime();

      taskTime.timeSpent = 10;
      taskTime.id = 2;
      taskTime.task = task;

      const taskTimeDto: TaskTimeDto = new TaskTimeDto();

      taskTimeDto.totalTimeSpent = taskTime.timeSpent;
      taskTimeDto.id = taskTime.id;
      taskTimeDto.task = taskTime.task;

      const taskTimes: Array<TaskTime> = [taskTime];
      const userNumberOfTaskTimes: number = 1;
      const page: number = 1;

      const expected: GetPaginatedTaskTimesResponseDto = new GetPaginatedTaskTimesResponseDto();

      expected.isLastPage = true;
      expected.page = page;
      expected.taskTimes = [taskTimeDto];

      const result: GetPaginatedTaskTimesResponseDto =
        taskTimeMapper.fromTaskTimesToGetPaginatedTaskTimesResponse(
          taskTimes,
          userNumberOfTaskTimes,
          page,
        );

      expect(result).toEqual(expected);
    });
  });
});
