import { Controller } from '@nestjs/common';
import { TaskTimeService } from '@services';

@Controller('task-time')
export class TaskTimeController {
  constructor(private taskTimeService: TaskTimeService) {}
}
