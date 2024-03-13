import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { TaskTimeController } from '@controllers';
import { TaskTime, User } from '@entities';
import { AuthMapper, TaskTimeMapper, UserMapper } from '@mappers';
import { TaskTimeValidator, UserValidator } from '@validators';
import {
  CreateTaskTimeRequestDto,
  CreateTaskTimeResponseDto,
  UpdateTaskTimeRequestDto,
  UpdateTaskTimeResponseDto,
} from '@dtos';
import { calculateDifferenceInSeconds } from '@utils';
import { DeleteTaskTimeException, UpdateTaskTimeException } from '@exceptions';
import { DELETE_TASK_TIME_NOT_FOUND, UPDATE_TASK_TIME_MISSING_TASK_TIME } from '@constants';
import { TaskTimeService } from './taskTime.service';
import { UserService } from '../user/user.service';
import { AuthService } from '../auth/auth.service';

jest.mock('@utils', () => ({
  ...jest.requireActual('@utils'),
  calculateDifferenceInSeconds: jest.fn(() => 60),
}));

describe('TaskTime service tests', () => {
  let taskTimeService: TaskTimeService;
  let taskTimeRepository: Repository<TaskTime>;
  let taskTimeMapper: TaskTimeMapper;
  let taskTimeValidator: TaskTimeValidator;

  beforeEach(async () => {
    const ref: TestingModule = await Test.createTestingModule({
      controllers: [TaskTimeController],
      providers: [
        TaskTimeMapper,
        TaskTimeService,
        TaskTimeValidator,
        ConfigService,
        UserService,
        UserValidator,
        UserMapper,
        AuthService,
        AuthMapper,
        JwtService,
        {
          provide: getRepositoryToken(User),
          useValue: {},
        },
        {
          provide: getRepositoryToken(TaskTime),
          useValue: { save: jest.fn(), findOneBy: jest.fn(), update: jest.fn(), delete: jest.fn() },
        },
      ],
    }).compile();

    taskTimeService = ref.get<TaskTimeService>(TaskTimeService);
    taskTimeRepository = ref.get<Repository<TaskTime>>(getRepositoryToken(TaskTime));
    taskTimeMapper = ref.get<TaskTimeMapper>(TaskTimeMapper);
    taskTimeValidator = ref.get<TaskTimeValidator>(TaskTimeValidator);
  });

  describe('createTaskTime tests', () => {
    it('Create a task time with success', async () => {
      const request: CreateTaskTimeRequestDto = new CreateTaskTimeRequestDto();

      request.taskId = 1;

      const taskTime: TaskTime = new TaskTime();
      const response: CreateTaskTimeResponseDto = new CreateTaskTimeResponseDto();

      jest.spyOn(taskTimeMapper, 'fromCreateTaskTimeToTaskTime').mockReturnValueOnce(taskTime);
      jest.spyOn(taskTimeRepository, 'save').mockResolvedValueOnce(taskTime);
      jest
        .spyOn(taskTimeMapper, 'fromTaskTimeToCreateTaskTimeResponse')
        .mockReturnValueOnce(response);

      const result: CreateTaskTimeResponseDto = await taskTimeService.createTaskTime(request);

      expect(result).toBe(response);
      expect(taskTimeMapper.fromCreateTaskTimeToTaskTime).toHaveBeenCalled();
      expect(taskTimeMapper.fromTaskTimeToCreateTaskTimeResponse).toHaveBeenCalled();
      expect(taskTimeRepository.save).toHaveBeenCalled();
      expect(calculateDifferenceInSeconds).toHaveBeenCalled();
    });
  });

  describe('updateTaskTime tests', () => {
    it('Updates a task time with success', async () => {
      const taskTimeId: number = 1;
      const request: UpdateTaskTimeRequestDto = new UpdateTaskTimeRequestDto();
      const taskTime: TaskTime = new TaskTime();

      taskTime.id = taskTimeId;

      const response: UpdateTaskTimeResponseDto = new UpdateTaskTimeResponseDto();

      jest.spyOn(taskTimeValidator, 'validateTaskTimeUpdateRequest').mockImplementation(() => {});
      jest.spyOn(taskTimeService, 'findOneById').mockResolvedValueOnce(taskTime);
      jest
        .spyOn(taskTimeMapper, 'fromUpdateTaskTimeRequestToTaskTime')
        .mockReturnValueOnce(taskTime);
      jest.spyOn(taskTimeService, 'updateById').mockResolvedValueOnce(taskTime);
      jest
        .spyOn(taskTimeMapper, 'fromTaskTimeToUpdateTaskTimeResponse')
        .mockReturnValueOnce(response);

      const result: UpdateTaskTimeResponseDto = await taskTimeService.updateTaskTime(
        request,
        taskTimeId,
      );

      expect(result).toBe(response);
      expect(taskTimeValidator.validateTaskTimeUpdateRequest).toHaveBeenCalled();
      expect(taskTimeService.findOneById).toHaveBeenCalledWith(taskTimeId);
      expect(taskTimeMapper.fromUpdateTaskTimeRequestToTaskTime).toHaveBeenCalled();
      expect(taskTimeService.updateById).toHaveBeenCalledWith(taskTime, taskTimeId);
      expect(taskTimeMapper.fromTaskTimeToUpdateTaskTimeResponse).toHaveBeenCalled();
    });

    it('Updates a task time without finded task time should throw', async () => {
      const taskTimeId = 1;
      const request: UpdateTaskTimeRequestDto = new UpdateTaskTimeRequestDto();

      jest.spyOn(taskTimeValidator, 'validateTaskTimeUpdateRequest').mockImplementation(() => {});
      jest.spyOn(taskTimeService, 'findOneById').mockResolvedValueOnce(null);

      const act: Function = async () => {
        await taskTimeService.updateTaskTime(request, taskTimeId);
      };

      expect(act).rejects.toThrow(UpdateTaskTimeException);
      expect(act).rejects.toThrow(`${UPDATE_TASK_TIME_MISSING_TASK_TIME}${taskTimeId}.`);
    });
  });

  describe('deleteTaskTime tests', () => {
    it('Delete a task time with success', async () => {
      const taskTimeId: number = 1;
      const taskTime: TaskTime = new TaskTime();
      const deleteResponse: DeleteResult = new DeleteResult();

      jest.spyOn(taskTimeValidator, 'validateTaskTimeDelete').mockImplementationOnce(() => {});
      jest.spyOn(taskTimeService, 'findOneById').mockResolvedValueOnce(taskTime);
      jest.spyOn(taskTimeRepository, 'delete').mockResolvedValueOnce(deleteResponse);

      await taskTimeService.deleteTaskTime(taskTimeId);

      expect(taskTimeValidator.validateTaskTimeDelete).toHaveBeenCalledWith(taskTimeId);
      expect(taskTimeService.findOneById).toHaveBeenCalledWith(taskTimeId);
      expect(taskTimeRepository.delete).toHaveBeenCalledWith({ id: taskTimeId });
    });

    it('Delete a task without finded task time should throw', async () => {
      const taskTimeId: number = 1;

      jest.spyOn(taskTimeValidator, 'validateTaskTimeDelete').mockImplementationOnce(() => {});
      jest.spyOn(taskTimeService, 'findOneById').mockResolvedValueOnce(null);

      const act: Function = async () => {
        await taskTimeService.deleteTaskTime(taskTimeId);
      };

      expect(act).rejects.toThrow(DeleteTaskTimeException);
      expect(act).rejects.toThrow(DELETE_TASK_TIME_NOT_FOUND);
      expect(taskTimeValidator.validateTaskTimeDelete).toHaveBeenCalledWith(taskTimeId);
      expect(taskTimeService.findOneById).toHaveBeenCalledWith(taskTimeId);
    });
  });

  describe('findOneById tests', () => {
    it('Find task time with success', async () => {
      const taskTimeId: number = 1;
      const taskTime: TaskTime = new TaskTime();

      jest.spyOn(taskTimeRepository, 'findOneBy').mockResolvedValueOnce(taskTime);

      const result: TaskTime = await taskTimeService.findOneById(taskTimeId);

      expect(result).toBe(taskTime);
      expect(taskTimeRepository.findOneBy).toHaveBeenCalledWith({ id: taskTimeId });
    });
  });

  describe('updateById tests', () => {
    it('Update a task time and return it with success', async () => {
      const taskTimeId: number = 1;
      const taskTime: TaskTime = new TaskTime();
      const updateResponse: UpdateResult = new UpdateResult();

      jest.spyOn(taskTimeRepository, 'update').mockResolvedValueOnce(updateResponse);
      jest.spyOn(taskTimeService, 'findOneById').mockResolvedValueOnce(taskTime);

      const result: TaskTime = await taskTimeService.updateById(taskTime, taskTimeId);

      expect(result).toBe(taskTime);
      expect(taskTimeService.findOneById).toHaveBeenCalledWith(taskTimeId);
      expect(taskTimeRepository.update).toHaveBeenCalledWith({ id: taskTimeId }, taskTime);
    });
  });
});
