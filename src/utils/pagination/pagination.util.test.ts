import { NUMBER_OF_ENTRIES_PER_PAGE } from '@constants';
import { TaskTimePaginationDto } from '@dtos';
import { getTaskOffsetByPage } from './pagination.util';

describe('getTaskOffsetByPage tests', () => {
  it('Get offset from page with Success', () => {
    const page: number = 2;
    const expected: TaskTimePaginationDto = new TaskTimePaginationDto();

    expected.end = page * NUMBER_OF_ENTRIES_PER_PAGE;
    expected.initial = expected.end - NUMBER_OF_ENTRIES_PER_PAGE;

    const response: TaskTimePaginationDto = getTaskOffsetByPage(page);

    expect(response).toEqual(expected);
  });
});
