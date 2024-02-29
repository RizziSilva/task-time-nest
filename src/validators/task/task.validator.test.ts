import { CreateTaskRequestDto } from '@dtos';
import { CreateTaskException, UpdateTaskException } from '@exceptions';
import { TaskValidator } from './task.validator';
import {
  CREATE_TASK_EXCEPTION_MISSING_ENDED,
  CREATE_TASK_EXCEPTION_MISSING_INITIATED,
  CREATE_TASK_EXCEPTION_TIMES_RELATION,
  TEN_MINUTES,
  UPDATE_TASK_EXCEPTION_MISSING_TASK_ID,
} from '@constants';

describe('TaskValidator tests', () => {
  let validator: TaskValidator;

  beforeEach(() => {
    validator = new TaskValidator();
  });

  function dateHelper(date: Date, minutes: number) {
    const newDate = new Date(date);

    newDate.setMinutes(newDate.getMinutes() + minutes);

    return newDate;
  }

  describe('validateCreateTaskRequest Tests', () => {
    it('Validate request with valid times', () => {
      const now: Date = new Date();
      const request: CreateTaskRequestDto = new CreateTaskRequestDto();

      request.initiatedAt = now;
      request.endedAt = dateHelper(now, TEN_MINUTES);

      const act: Function = () => {
        validator.validateCreateTaskRequest(request);
      };

      expect(act).not.toThrow();
    });

    it('Validate request without initial time throw exception', () => {
      const request: CreateTaskRequestDto = new CreateTaskRequestDto();

      request.endedAt = new Date();

      const act: Function = () => {
        validator.validateCreateTaskRequest(request);
      };

      expect(act).toThrow(CreateTaskException);
      expect(act).toThrow(CREATE_TASK_EXCEPTION_MISSING_INITIATED);
    });

    it('Validate request without endedAt time throw exception', () => {
      const request: CreateTaskRequestDto = new CreateTaskRequestDto();

      request.initiatedAt = new Date();

      const act: Function = () => {
        validator.validateCreateTaskRequest(request);
      };

      expect(act).toThrow(CreateTaskException);
      expect(act).toThrow(CREATE_TASK_EXCEPTION_MISSING_ENDED);
    });

    it('Validate request with initial time after ended time throw exception', () => {
      const request: CreateTaskRequestDto = new CreateTaskRequestDto();
      const now: Date = new Date();

      request.initiatedAt = dateHelper(now, TEN_MINUTES);
      request.endedAt = now;

      const act: Function = () => {
        validator.validateCreateTaskRequest(request);
      };

      expect(act).toThrow(CreateTaskException);
      expect(act).toThrow(CREATE_TASK_EXCEPTION_TIMES_RELATION);
    });
  });

  describe('validateUpdateTaskRequest Tests', () => {
    it('Validate taskId exists with success', () => {
      const taskId: number = 1;

      const act: Function = () => {
        validator.validateUpdateTaskRequest(taskId);
      };

      expect(act).not.toThrow();
    });

    it('Validate taskId exists throw exception', () => {
      const act: Function = () => {
        validator.validateUpdateTaskRequest(undefined);
      };

      expect(act).toThrow(UpdateTaskException);
      expect(act).toThrow(UPDATE_TASK_EXCEPTION_MISSING_TASK_ID);
    });
  });
});
