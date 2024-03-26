import { TaskDto } from './task.dto';

export class GetPaginatedTaskResponseDto {
  tasks: Array<TaskDto> = [];
  page: number;
  isLastPage: boolean;
}
