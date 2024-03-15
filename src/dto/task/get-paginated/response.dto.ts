import { TasksDto } from './task.dto';

export class GetPaginatedTaskResponseDto {
  tasks: Array<TasksDto>;
  page: number;
  isLastPage: boolean;
}
