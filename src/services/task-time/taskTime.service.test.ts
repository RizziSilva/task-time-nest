import { TaskTimeController } from '@controllers';
import { TaskTime } from '@entities';
import { TaskTimeMapper } from '@mappers';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TaskTimeService } from './taskTime.service';
import { TaskTimeValidator } from '@validators';
import { Repository } from 'typeorm';
import { CreateTaskTimeRequestDto, CreateTaskTimeResponseDto } from '@dtos';
import { calculateDifferenceInSeconds } from '@utils';

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
        {
          provide: getRepositoryToken(TaskTime),
          useValue: { save: jest.fn() },
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
});
