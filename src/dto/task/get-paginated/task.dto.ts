import { GetPaginatedTimesDto } from './times.dto';

export class TaskDto {
  id: number;
  title: string;
  description: string;
  link: string;
  times: Array<GetPaginatedTimesDto> = [];
  totalTimeSpent: number = 0;
}
