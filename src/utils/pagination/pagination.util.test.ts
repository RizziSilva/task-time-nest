import { TasksPagination } from '@interfaces';
import { getTaskOffsetByPage } from './pagination.util';
import { NUMBER_OF_ENTRIES_PER_PAGE } from '@constants';

describe('getTaskOffsetByPage tests', () => {
  it('Get offset from page with Success', () => {
    const page: number = 2;
    const expected: TasksPagination = new TasksPagination();

    expected.end = page * NUMBER_OF_ENTRIES_PER_PAGE;
    expected.initial = expected.end - NUMBER_OF_ENTRIES_PER_PAGE;

    const response: TasksPagination = getTaskOffsetByPage(page);

    expect(response).toEqual(expected);
  });
});
