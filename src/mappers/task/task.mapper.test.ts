import {
  CreateTaskRequestDto,
  CreateTaskResponseDto,
  CreateTaskTimeResponseDto,
  GetPaginatedTaskResponseDto,
  GetPaginatedTimesDto,
  TasksDto,
  TimesDto,
  UpdateTaskRequestDto,
  UpdateTaskResponseDto,
} from '@dtos';
import { TaskMapper } from './task.mapper';
import { Task } from '@entities';
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

      const result: UpdateTaskResponseDto = taskMapper.fromTaskToTaskUpdateResponse(task);

      expect(result).toEqual(task);
    });
  });

  describe('formTasksAndTimesToPaginatedTasksResponse tests', () => {
    interface tasksMock {
      taskAndTime: TaskAndTime;
      taskDto: TasksDto;
    }

    function createTasksAndTimes(taskId: number): tasksMock {
      const timeSpent: number = 100;
      const taskAndTime: TaskAndTime = new TaskAndTime();

      taskAndTime.taskId = taskId;
      taskAndTime.timeSpent = timeSpent;

      const taskDto: TasksDto = new TasksDto();
      const timesDto: GetPaginatedTimesDto = new GetPaginatedTimesDto();

      timesDto.totalTimeSpent = timeSpent;
      taskDto.id = taskId;
      taskDto.totalTimeSpent = timeSpent;
      taskDto.times = [timesDto];

      return { taskAndTime, taskDto };
    }

    it('Convert tasks and times to paginated response', () => {
      const mockedTasks: tasksMock = createTasksAndTimes(1);
      const mockedTasksTwo: tasksMock = createTasksAndTimes(2);
      const allTasksAndTimes: Array<TaskAndTime> = new Array<TaskAndTime>();

      allTasksAndTimes.push(mockedTasks.taskAndTime);
      allTasksAndTimes.push(mockedTasksTwo.taskAndTime);

      const page: number = 1;
      const userNumberOfTasks: number = 2;
      const expected: GetPaginatedTaskResponseDto = new GetPaginatedTaskResponseDto();
      const allTasksDtos: Array<TasksDto> = [mockedTasks.taskDto, mockedTasksTwo.taskDto];

      expected.isLastPage = true;
      expected.page = 1;
      expected.tasks = allTasksDtos;

      const response: GetPaginatedTaskResponseDto =
        taskMapper.formTasksAndTimesToPaginatedTasksResponse(
          allTasksAndTimes,
          page,
          userNumberOfTasks,
        );

      expect(response).toEqual(expected);
      expect(response.tasks.length).toBe(allTasksDtos.length);
    });
  });
});
