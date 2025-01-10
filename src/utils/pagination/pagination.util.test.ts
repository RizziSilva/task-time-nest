import { NUMBER_OF_ENTRIES_PER_PAGE } from '@constants';
import { TaskTimePaginationDto } from '@dtos';
import { getTaskTimeOffsetByPage } from './pagination.util';

describe('getTaskTimeOffsetByPage tests', () => {
  it('Get offset from page with Success', () => {
    const page: number = 2;
    const expected: TaskTimePaginationDto = new TaskTimePaginationDto();

    expected.end = page * NUMBER_OF_ENTRIES_PER_PAGE;
    expected.initial = expected.end - NUMBER_OF_ENTRIES_PER_PAGE;

    const response: TaskTimePaginationDto = getTaskTimeOffsetByPage(page);

    expect(response).toEqual(expected);
  });
});
