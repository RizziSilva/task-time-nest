import dayjs from 'dayjs';
import { CreateTaskTimeRequestDto, CreateTaskTimeResponseDto } from '@dtos';
import { TaskTime } from '@entities';
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

      const timeSpent: number = 1234;
      const expected: TaskTime = new TaskTime();

      expected.initiatedAt = request.initiatedAt;
      expected.endedAt = request.endedAt;
      expected.timeSpent = timeSpent;
      expected.taskId = request.taskId;
      expected.createdAt = dayjs(new Date()).format(DATE_TIME_FORMAT);

      const result: TaskTime = taskTimeMapper.fromCreateTaskTimeToTaskTime(request, timeSpent);

      expect(result).toEqual(expected);
    });
  });

  describe('fromTaskTimeToCreateTaskTimeResponse tests', () => {
    it('Converts task time to create task time response', () => {
      const taskTime: TaskTime = new TaskTime();

      taskTime.taskId = 1;
      taskTime.timeSpent = 1234;
      taskTime.initiatedAt = '2024-02-26 10:30:18';
      taskTime.endedAt = '2024-02-26 12:00:00';

      const result: CreateTaskTimeResponseDto =
        taskTimeMapper.fromTaskTimeToCreateTaskTimeResponse(taskTime);

      expect(result).toEqual(taskTime);
    });
  });
});