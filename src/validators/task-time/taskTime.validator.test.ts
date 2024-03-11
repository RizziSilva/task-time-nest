import { CreateTaskTimeRequestDto, UpdateTaskTimeRequestDto } from '@dtos';
import { CreateTaskTimeException, UpdateTaskTimeException } from '@exceptions';
import {
  CREATE_TASK_TIME_MISSING_TASK_ID,
  UPDATE_TASK_TIME_MISSING_ENDED,
  UPDATE_TASK_TIME_MISSING_INITIATED,
  UPDATE_TASK_TIME_MISSING_TASK_TIME_ID,
  UPDATE_TASK_TIME_TIMES_RELATION,
} from '@constants';
import { TaskTimeValidator } from './taskTime.validator';

describe('TaskTime validator tests', () => {
  let validator: TaskTimeValidator;

  beforeEach(() => {
    validator = new TaskTimeValidator();
  });

  describe('validateTaskTimeCreateRequest tests', () => {
    it('Validate create task time request with success shouldnt throw', () => {
      const taskId: number = 1;
      const request: CreateTaskTimeRequestDto = new CreateTaskTimeRequestDto();

      request.taskId = taskId;

      const act: Function = () => {
        validator.validateTaskTimeCreateRequest(request);
      };

      expect(act).not.toThrow();
    });

    it('Validate create task time request with success should throw', () => {
      const request: CreateTaskTimeRequestDto = new CreateTaskTimeRequestDto();

      const act: Function = () => {
        validator.validateTaskTimeCreateRequest(request);
      };

      expect(act).toThrow(CreateTaskTimeException);
      expect(act).toThrow(CREATE_TASK_TIME_MISSING_TASK_ID);
    });
  });

  describe('validateTaskTimeUpdateRequest tests', () => {
    it('validate update task time with success', () => {
      const tasktimeId: number = 1;

      const request: UpdateTaskTimeRequestDto = new UpdateTaskTimeRequestDto();

      request.initiatedAt = '2024-02-26 10:40:00';
      request.endedAt = '2024-02-26 11:00:00';

      const act: Function = () => {
        validator.validateTaskTimeUpdateRequest(request, tasktimeId);
      };

      expect(act).not.toThrow();
    });

    it('validate update task time without task time id should throw', () => {
      const tasktimeId: number = undefined;

      const request: UpdateTaskTimeRequestDto = new UpdateTaskTimeRequestDto();

      request.initiatedAt = '2024-02-26 10:40:00';
      request.endedAt = '2024-02-26 11:00:00';

      const act: Function = () => {
        validator.validateTaskTimeUpdateRequest(request, tasktimeId);
      };

      expect(act).toThrow(UpdateTaskTimeException);
      expect(act).toThrow(UPDATE_TASK_TIME_MISSING_TASK_TIME_ID);
    });

    it('validate update task time without initial time should throw', () => {
      const tasktimeId: number = 1;

      const request: UpdateTaskTimeRequestDto = new UpdateTaskTimeRequestDto();

      request.initiatedAt = undefined;
      request.endedAt = '2024-02-26 11:00:00';

      const act: Function = () => {
        validator.validateTaskTimeUpdateRequest(request, tasktimeId);
      };

      expect(act).toThrow(UpdateTaskTimeException);
      expect(act).toThrow(UPDATE_TASK_TIME_MISSING_INITIATED);
    });

    it('validate update task time without ended time should throw', () => {
      const tasktimeId: number = 1;

      const request: UpdateTaskTimeRequestDto = new UpdateTaskTimeRequestDto();

      request.initiatedAt = '2024-02-26 10:40:00';
      request.endedAt = undefined;

      const act: Function = () => {
        validator.validateTaskTimeUpdateRequest(request, tasktimeId);
      };

      expect(act).toThrow(UpdateTaskTimeException);
      expect(act).toThrow(UPDATE_TASK_TIME_MISSING_ENDED);
    });

    it('validate update task time with initial time after ended time should throw', () => {
      const tasktimeId: number = 1;

      const request: UpdateTaskTimeRequestDto = new UpdateTaskTimeRequestDto();

      request.initiatedAt = '2024-02-26 11:40:00';
      request.endedAt = '2024-02-26 11:00:00';

      const act: Function = () => {
        validator.validateTaskTimeUpdateRequest(request, tasktimeId);
      };

      expect(act).toThrow(UpdateTaskTimeException);
      expect(act).toThrow(UPDATE_TASK_TIME_TIMES_RELATION);
    });
  });
});
