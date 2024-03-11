import dayjs, { Dayjs } from 'dayjs';

export function calculateDifferenceInSeconds(initiated: string, ended: string) {
  const initialDate: Dayjs = dayjs(ended);

  return initialDate.diff(initiated, 'second');
}
