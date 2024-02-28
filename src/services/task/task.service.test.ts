import { TaskController } from '@controllers';
import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { AuthMapper, TaskMapper, UserMapper } from '@mappers';
import { TaskValidator, UserValidator } from '@validators';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task, User } from '@entities';
import { Repository } from 'typeorm';
import { AuthLoginResponseDto, CreateTaskRequestDto, CreateTaskResponseDto } from '@dtos';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';

describe('TaskService Tests', () => {
  let taskService: TaskService;
  let taskMapper: TaskMapper;
  let taskRepository: Repository<Task>;
  let taskValidator: TaskValidator;

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
        {
          provide: getRepositoryToken(User),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Task),
          useValue: { save: jest.fn() },
        },
      ],
    }).compile();

    taskService = ref.get<TaskService>(TaskService);
    taskMapper = ref.get<TaskMapper>(TaskMapper);
    taskRepository = ref.get<Repository<Task>>(getRepositoryToken(Task));
    taskValidator = ref.get<TaskValidator>(TaskValidator);
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

      const response: CreateTaskResponseDto = new CreateTaskResponseDto();
      response.title = request.title;
      response.description = request.description;

      jest.spyOn(taskValidator, 'validateCreateTaskRequest').mockImplementation(() => {});
      jest.spyOn(taskMapper, 'fromCreateRequestToTask').mockReturnValueOnce(task);
      jest.spyOn(taskRepository, 'save').mockResolvedValueOnce(task);
      jest.spyOn(taskMapper, 'fromTaskToCreateTaskResponse').mockReturnValueOnce(response);

      const result: CreateTaskResponseDto = await taskService.create(user, request);

      expect(result).toEqual(response);
      expect(taskValidator.validateCreateTaskRequest).toHaveBeenCalled();
      expect(taskMapper.fromCreateRequestToTask).toHaveBeenCalledWith(user.id, request);
      expect(taskRepository.save).toHaveBeenCalled();
      expect(taskMapper.fromTaskToCreateTaskResponse).toHaveBeenCalled();
    });
  });
});
