import { GetPaginatedTimesDto } from './times.dto';

export class TasksDto {
  id: number;
  idUser: number;
  title: string;
  description: string;
  link: string;
  createdAt: string;
  updatedAt: string;
  times: Array<GetPaginatedTimesDto>;
  totalTimeSpent: number;
}
