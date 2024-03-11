import { ONE_MINUTE_IN_SECONDS, ONE_HOURS_IN_MINUTES } from '@constants';
import { calculateDifferenceInSeconds } from './date.util';

describe('Date utils tests', () => {
  it('calculateDifferenceInSeconds from two string dates with seconds in difference', () => {
    const secondsDifference: number = 30;
    const initialDate: string = '2024-02-26 10:30:00';
    const endedDate: string = `2024-02-26 10:30:${secondsDifference}`;

    const difference: number = calculateDifferenceInSeconds(initialDate, endedDate);

    expect(difference).toEqual(secondsDifference);
  });

  it('calculateDifferenceInSeconds from two string dates with minutes in difference', () => {
    const minutes: number = 30;
    const minutesDifference: number = 10;
    const initialDate: string = `2024-02-26 10:${minutes}:00`;
    const endedDate: string = `2024-02-26 10:${minutes + minutesDifference}:00`;
    const result: number = minutesDifference * ONE_MINUTE_IN_SECONDS;

    const difference: number = calculateDifferenceInSeconds(initialDate, endedDate);

    expect(difference).toEqual(result);
  });

  it('calculateDifferenceInSeconds from two string dates with hours in difference', () => {
    const hours: number = 2;
    const hoursDifference: number = 2;
    const initialDate: string = `2024-02-26 1${hours}:00:00`;
    const endedDate: string = `2024-02-26 1${hours + hoursDifference}:00:00:00`;
    const result: number = hoursDifference * (ONE_MINUTE_IN_SECONDS * ONE_HOURS_IN_MINUTES);

    const difference: number = calculateDifferenceInSeconds(initialDate, endedDate);

    expect(difference).toEqual(result);
  });
});
