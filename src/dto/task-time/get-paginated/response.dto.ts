import { TaskTimeDto } from './taskTime.dto';

export class GetPaginatedTaskTimesResponseDto {
  taskTimes: Array<TaskTimeDto>;
  page: number;
  isLastPage: boolean;
}
