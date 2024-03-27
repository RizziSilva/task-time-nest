import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { TaskTimeValidator, TaskValidator, UserValidator } from '@validators';
import { AuthMapper, TaskMapper, TaskTimeMapper, UserMapper } from '@mappers';
import { TaskController } from '@controllers';
import { Task, TaskTime, User } from '@entities';
import {
  AuthLoginResponseDto,
  CreateTaskRequestDto,
  CreateTaskResponseDto,
  CreateTaskTimeRequestDto,
  CreateTaskTimeResponseDto,
  GetPaginatedTaskRequestDto,
  GetPaginatedTaskResponseDto,
  GetTaskResponseDto,
  UpdateTaskRequestDto,
  UpdateTaskResponseDto,
} from '@dtos';
import { TasksPagination, UpdateTask } from '@interfaces';
import { DeleteTaskException, GetTaskException, UpdateTaskException } from '@exceptions';
import {
  DELETE_TASK_NOT_FOUND,
  GET_TASK_NOT_FOUND,
  UPDATE_TASK_EXCEPTION_TASK_NOT_FOUND,
} from '@constants';
import { getTaskOffsetByPage } from '@utils';
import { UserService } from '../user/user.service';
import { AuthService } from '../auth/auth.service';
import { TaskService } from './task.service';
import { TaskTimeService } from '../task-time/taskTime.service';

jest.mock('@utils', () => ({
  ...jest.requireActual('@utils'),
  getTaskOffsetByPage: jest.fn(() => new TasksPagination()),
}));

describe('TaskService Tests', () => {
  let taskService: TaskService;
  let taskMapper: TaskMapper;
  let taskRepository: Repository<Task>;
  let taskValidator: TaskValidator;
  let taskTimeService: TaskTimeService;

  beforeEach(async () => {
    const ref: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        TaskService,
        TaskMapper,
        ConfigService,
        UserService,
        UserValidator,
        UserMapper,
        AuthService,
        AuthMapper,
        JwtService,
        TaskValidator,
        TaskTimeService,
        TaskTimeValidator,
        TaskTimeMapper,
        {
          provide: getRepositoryToken(User),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Task),
          useValue: {
            save: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            find: jest.fn(),
            count: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(TaskTime),
          useValue: {},
        },
      ],
    }).compile();

    taskService = ref.get<TaskService>(TaskService);
    taskMapper = ref.get<TaskMapper>(TaskMapper);
    taskRepository = ref.get<Repository<Task>>(getRepositoryToken(Task));
    taskValidator = ref.get<TaskValidator>(TaskValidator);
    taskTimeService = ref.get<TaskTimeService>(TaskTimeService);
  });

  describe('create Tests', () => {
    it('Creates a task with success', async () => {
      const user: AuthLoginResponseDto = new AuthLoginResponseDto();
      user.id = 1;

      const request: CreateTaskRequestDto = new CreateTaskRequestDto();
      request.title = 'Some title';
      request.description = 'Create task test';

      const task: Task = new Task();
      task.title = request.title;
      task.description = request.description;
      task.id = 1;

      const response: CreateTaskResponseDto = new CreateTaskResponseDto();
      response.title = request.title;
      response.description = request.description;

      const taskTimeRequest: CreateTaskTimeRequestDto = new CreateTaskTimeRequestDto();

      const taskTimeResponse: CreateTaskTimeResponseDto = new CreateTaskTimeResponseDto();

      jest.spyOn(taskValidator, 'validateCreateTaskRequest').mockImplementation(() => {});
      jest.spyOn(taskMapper, 'fromCreateRequestToTask').mockReturnValueOnce(task);
      jest.spyOn(taskRepository, 'save').mockResolvedValueOnce(task);
      jest
        .spyOn(taskMapper, 'fromTaskAndTaskTimeToCreateTaskResponse')
        .mockReturnValueOnce(response);
      jest
        .spyOn(taskMapper, 'fromCreateRequestToCreateTaskTimeRequest')
        .mockReturnValueOnce(taskTimeRequest);
      jest.spyOn(taskTimeService, 'createTaskTime').mockResolvedValueOnce(taskTimeResponse);

      const result: CreateTaskResponseDto = await taskService.create(user, request);

      expect(result).toEqual(response);
      expect(taskValidator.validateCreateTaskRequest).toHaveBeenCalled();
      expect(taskMapper.fromCreateRequestToTask).toHaveBeenCalledWith(user.id, request);
      expect(taskRepository.save).toHaveBeenCalled();
      expect(taskMapper.fromTaskAndTaskTimeToCreateTaskResponse).toHaveBeenCalled();
      expect(taskMapper.fromCreateRequestToCreateTaskTimeRequest).toHaveBeenCalled();
      expect(taskTimeService.createTaskTime).toHaveBeenCalled();
    });
  });

  describe('update Tests', () => {
    it('Updates a task with success', async () => {
      const taskId: number = 1;

      const request: UpdateTaskRequestDto = new UpdateTaskRequestDto();
      request.description = 'Test description';

      const task: Task = new Task();

      const updateTask: UpdateTask = new UpdateTask();
      updateTask.description = request.description;

      const updatedTask: Task = new Task();
      updatedTask.description = request.description;

      const response: UpdateTaskResponseDto = new UpdateTaskResponseDto();
      response.description = updatedTask.description;

      jest.spyOn(taskValidator, 'validateUpdateTaskRequest').mockImplementationOnce(() => {});
      jest.spyOn(taskService, 'findOneById').mockResolvedValueOnce(task);
      jest.spyOn(taskMapper, 'fromTaskUpdateRequestToUpdateTask').mockReturnValueOnce(updateTask);
      jest.spyOn(taskService, 'updateById').mockResolvedValueOnce(updatedTask);
      jest.spyOn(taskMapper, 'fromTaskToTaskUpdateResponse').mockReturnValueOnce(response);

      const result: UpdateTaskResponseDto = await taskService.update(taskId, request);

      expect(result).toEqual(response);
      expect(taskValidator.validateUpdateTaskRequest).toHaveBeenCalledWith(taskId);
      expect(taskService.findOneById).toHaveBeenCalledWith(taskId);
      expect(taskMapper.fromTaskUpdateRequestToUpdateTask).toHaveBeenCalled();
      expect(taskService.updateById).toHaveBeenCalledWith(taskId, updateTask);
      expect(taskMapper.fromTaskToTaskUpdateResponse).toHaveBeenCalled();
    });

    it('Updates a task with task not found by id throws exception', async () => {
      const taskId: number = 1;

      const request: UpdateTaskRequestDto = new UpdateTaskRequestDto();

      jest.spyOn(taskService, 'findOneById').mockResolvedValueOnce(null);

      const act: Function = async () => {
        await taskService.update(taskId, request);
      };

      expect(act).rejects.toThrow(UpdateTaskException);
      expect(act).rejects.toThrow(UPDATE_TASK_EXCEPTION_TASK_NOT_FOUND);
    });
  });

  describe('deleteTask tests', () => {
    it('Delete a task and its task times with success', async () => {
      const taskId: number = 1;
      const task: Task = new Task();

      jest.spyOn(taskValidator, 'validateDeleteTask').mockImplementationOnce(() => {});
      jest.spyOn(taskService, 'findOneById').mockResolvedValueOnce(task);
      jest.spyOn(taskRepository, 'remove').mockResolvedValueOnce(task);

      await taskService.deleteTask(taskId);

      expect(taskValidator.validateDeleteTask).toHaveBeenCalledWith(taskId);
      expect(taskService.findOneById).toHaveBeenCalledWith(taskId);
      expect(taskRepository.remove).toHaveBeenCalledWith(task);
    });
    it('Delete a task without finded task throw error', async () => {
      const taskId: number = 2;

      jest.spyOn(taskValidator, 'validateDeleteTask').mockImplementationOnce(() => {});
      jest.spyOn(taskService, 'findOneById').mockResolvedValueOnce(null);

      const act: Function = async () => {
        await taskService.deleteTask(taskId);
      };

      expect(act).rejects.toThrow(DeleteTaskException);
      expect(act).rejects.toThrow(DELETE_TASK_NOT_FOUND);
      expect(taskValidator.validateDeleteTask).toHaveBeenCalledWith(taskId);
      expect(taskService.findOneById).toHaveBeenCalledWith(taskId);
    });
  });

  describe('findOneById Tests', () => {
    it('Find one task by id and return with success', async () => {
      const taskId: number = 1;
      const task: Task = new Task();
      task.title = 'Some task';

      jest.spyOn(taskRepository, 'findOne').mockResolvedValueOnce(task);

      const result: Task = await taskService.findOneById(taskId);

      expect(result).toBe(task);
      expect(taskRepository.findOne).toHaveBeenCalled();
    });

    it('Try find one task by id and return null with success', async () => {
      const taskId: number = 2;

      jest.spyOn(taskRepository, 'findOne').mockResolvedValueOnce(null);

      const result: Task = await taskService.findOneById(taskId);

      expect(result).toBeNull();
      expect(taskRepository.findOne).toHaveBeenCalled();
    });
  });

  describe('updateById Tests', () => {
    it('Updates a task and return it with success', async () => {
      const taskId: number = 1;

      const updateTask: UpdateTask = new UpdateTask();
      updateTask.title = 'Some title';

      const updateResponse: UpdateResult = new UpdateResult();

      const task: Task = new Task();
      task.title = updateTask.title;

      jest.spyOn(taskRepository, 'update').mockResolvedValueOnce(updateResponse);
      jest.spyOn(taskService, 'findOneById').mockResolvedValueOnce(task);

      const result: Task = await taskService.updateById(taskId, updateTask);

      expect(result).toBe(task);
      expect(taskRepository.update).toHaveBeenCalledWith({ id: taskId }, { ...updateTask });
      expect(taskService.findOneById).toHaveBeenCalledWith(taskId);
    });
  });

  describe('getPaginatedTasks tests', () => {
    it('Get paginated user tasks with success', async () => {
      const request: GetPaginatedTaskRequestDto = new GetPaginatedTaskRequestDto();

      request.page = 1;
      request.userId = 15;

      const userNumberOfTasks: number = 10;
      const tasks: Array<Task> = new Array<Task>();
      const response: GetPaginatedTaskResponseDto = new GetPaginatedTaskResponseDto();

      jest.spyOn(taskService, 'countTasksByUserId').mockResolvedValueOnce(userNumberOfTasks);
      jest.spyOn(taskService, 'getTasksAndTaskTimesByUserAndPage').mockResolvedValueOnce(tasks);
      jest
        .spyOn(taskMapper, 'fromTasksToGetPaginatedTasksResponse')
        .mockImplementationOnce(() => response);

      const result: GetPaginatedTaskResponseDto = await taskService.getPaginatedTasks(request);

      expect(result).toEqual(response);
      expect(taskService.countTasksByUserId).toHaveBeenCalledWith(request.userId);
      expect(taskService.getTasksAndTaskTimesByUserAndPage).toHaveBeenCalled();
      expect(taskMapper.fromTasksToGetPaginatedTasksResponse).toHaveBeenCalledWith(
        tasks,
        request.page,
        userNumberOfTasks,
      );
      expect(getTaskOffsetByPage).toHaveBeenCalledWith(request.page);
    });
  });

  describe('getTask tests', () => {
    it('Get a task with success', async () => {
      const taskId: number = 1;
      const response: GetTaskResponseDto = new GetTaskResponseDto();
      const task: Task = new Task();

      jest.spyOn(taskValidator, 'validateGetTask').mockImplementationOnce(() => {});
      jest.spyOn(taskService, 'findOneById').mockResolvedValueOnce(task);
      jest.spyOn(taskMapper, 'fromTaskToGetTaskResponseDto').mockReturnValueOnce(response);

      const result: GetTaskResponseDto = await taskService.getTask(taskId);

      expect(result).toEqual(response);
      expect(taskValidator.validateGetTask).toHaveBeenCalled();
      expect(taskMapper.fromTaskToGetTaskResponseDto).toHaveBeenCalledWith(task);
      expect(taskService.findOneById).toHaveBeenCalledWith(taskId);
    });

    it('Get a task with success', async () => {
      const taskId: number = 1;

      jest.spyOn(taskValidator, 'validateGetTask').mockImplementationOnce(() => {});
      jest.spyOn(taskService, 'findOneById').mockResolvedValueOnce(null);

      const act: Function = async () => {
        await taskService.getTask(taskId);
      };

      expect(act).rejects.toThrow(GetTaskException);
      expect(act).rejects.toThrow(`${GET_TASK_NOT_FOUND}${taskId}.`);
      expect(taskValidator.validateGetTask).toHaveBeenCalled();
      expect(taskService.findOneById).toHaveBeenCalledWith(taskId);
    });
  });
});
