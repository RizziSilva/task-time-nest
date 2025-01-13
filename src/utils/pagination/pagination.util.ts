import { NUMBER_OF_ENTRIES_PER_PAGE } from '@constants';
import { TaskTimePaginationDto } from '@dtos';

export function getTaskTimeOffsetByPage(page: number): TaskTimePaginationDto {
  const pagination: TaskTimePaginationDto = new TaskTimePaginationDto();

  pagination.end = page * NUMBER_OF_ENTRIES_PER_PAGE;
  pagination.initial = pagination.end - NUMBER_OF_ENTRIES_PER_PAGE;

  return pagination;
}
