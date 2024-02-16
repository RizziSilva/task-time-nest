import { getIsValidName } from './name.util';

describe('Name util tests', () => {
  it('getIsValidName with valid name with success', () => {
    const name: string = 'Valid Name';

    const result: boolean = getIsValidName(name);

    expect(result).toBe(true);
  });

  it('getIsValidName with valid name using more then one surname with success', () => {
    const name: string = 'Valid Name With More Then One Surname';

    const result: boolean = getIsValidName(name);

    expect(result).toBe(true);
  });

  it('getIsValidName with valid name with success', () => {
    const name: string = 'Invalid';

    const result: boolean = getIsValidName(name);

    expect(result).toBe(false);
  });
});
