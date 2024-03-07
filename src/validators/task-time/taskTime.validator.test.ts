import { CreateTaskTimeRequestDto } from '@dtos';
import { CreateTaskTimeException } from '@exceptions';
import { CREATE_TASK_TIME_MISSING_TASK_ID } from '@constants';
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

    it('Validate create task time request with success shouldnt throw', () => {
      const request: CreateTaskTimeRequestDto = new CreateTaskTimeRequestDto();

      const act: Function = () => {
        validator.validateTaskTimeCreateRequest(request);
      };

      expect(act).toThrow(CreateTaskTimeException);
      expect(act).toThrow(CREATE_TASK_TIME_MISSING_TASK_ID);
    });
  });
});
