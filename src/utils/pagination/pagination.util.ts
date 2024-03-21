import { NUMBER_OF_ENTRIES_PER_PAGE } from '@constants';
import { TasksPagination } from '@interfaces';

export function getTaskOffsetByPage(page: number): TasksPagination {
  const pagination: TasksPagination = new TasksPagination();

  pagination.end = page * NUMBER_OF_ENTRIES_PER_PAGE;
  pagination.initial = pagination.end - NUMBER_OF_ENTRIES_PER_PAGE;

  return pagination;
}
