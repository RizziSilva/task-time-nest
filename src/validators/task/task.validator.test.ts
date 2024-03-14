import dayjs from 'dayjs';
import { CreateTaskRequestDto } from '@dtos';
import { CreateTaskException, DeleteTaskException, UpdateTaskException } from '@exceptions';
import {
  CREATE_TASK_EXCEPTION_MISSING_ENDED,
  CREATE_TASK_EXCEPTION_MISSING_INITIATED,
  CREATE_TASK_EXCEPTION_TIMES_RELATION,
  DATE_TIME_FORMAT,
  DELETE_TASK_MISSING_ID,
  TEN_MINUTES,
  UPDATE_TASK_EXCEPTION_MISSING_TASK_ID,
} from '@constants';
import { TaskValidator } from './task.validator';

describe('TaskValidator tests', () => {
  let validator: TaskValidator;

  beforeEach(() => {
    validator = new TaskValidator();
  });

  function dateHelper(date: Date, minutes: number) {
    const newDate = new Date(date);

    newDate.setMinutes(newDate.getMinutes() + minutes);

    return dayjs(newDate).format(DATE_TIME_FORMAT);
  }

  describe('validateCreateTaskRequest Tests', () => {
    it('Validate request with valid times', () => {
      const now: Date = new Date();
      const request: CreateTaskRequestDto = new CreateTaskRequestDto();

      request.initiatedAt = dayjs(now).format(DATE_TIME_FORMAT);
      request.endedAt = dateHelper(now, TEN_MINUTES);

      const act: Function = () => {
        validator.validateCreateTaskRequest(request);
      };

      expect(act).not.toThrow();
    });

    it('Validate request without initial time throw exception', () => {
      const request: CreateTaskRequestDto = new CreateTaskRequestDto();

      request.endedAt = dayjs(new Date()).format(DATE_TIME_FORMAT);

      const act: Function = () => {
        validator.validateCreateTaskRequest(request);
      };

      expect(act).toThrow(CreateTaskException);
      expect(act).toThrow(CREATE_TASK_EXCEPTION_MISSING_INITIATED);
    });

    it('Validate request without endedAt time throw exception', () => {
      const request: CreateTaskRequestDto = new CreateTaskRequestDto();

      request.initiatedAt = dayjs(new Date()).format(DATE_TIME_FORMAT);

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
      request.endedAt = dayjs(now).format(DATE_TIME_FORMAT);

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

  describe('validateDeleteTask tests', () => {
    it('Validate delete task shouldnt throw', () => {
      const taskId: number = 1;

      const act: Function = () => {
        validator.validateDeleteTask(taskId);
      };

      expect(act).not.toThrow();
    });

    it('Validate delete task without task id should throw', () => {
      const taskId: number = null;

      const act: Function = () => {
        validator.validateDeleteTask(taskId);
      };

      expect(act).toThrow(DeleteTaskException);
      expect(act).toThrow(DELETE_TASK_MISSING_ID);
    });
  });
});
