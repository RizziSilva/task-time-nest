import { GetTaskTimes } from './times.dto';

export class GetTaskResponseDto {
  id: number;
  title: string;
  link: string;
  description: string;
  idUser: number;
  times: Array<GetTaskTimes> = [];
  totalTimeSpent: number = 0;
  createdAt: string;
  updatedAt: string;
}
