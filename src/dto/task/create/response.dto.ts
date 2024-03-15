import { TimesDto } from './times.dto';

export class CreateTaskResponseDto {
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  link: string;
  id: number;
  times: TimesDto[];
  totalTimeSpent: number;
}
