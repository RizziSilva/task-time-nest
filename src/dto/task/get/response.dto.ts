import { GetTimesDto } from './times.dto';

export class GetTaskResponseDto {
  id: number;
  idUser: number;
  title: string;
  description: string;
  link: string;
  createdAt: string;
  updatedAt: string;
  times: GetTimesDto[];
}
