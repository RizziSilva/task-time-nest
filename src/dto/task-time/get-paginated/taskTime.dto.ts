import { GetPaginatedTaskDto } from './task.dto';

export class TaskTimeDto {
  initiatedAt: string;
  endedAt: string;
  totalTimeSpent: number;
  task: GetPaginatedTaskDto;
}
