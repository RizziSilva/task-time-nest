import { getIsPasswordValid } from './password.util';

describe('Password util Tests', () => {
  it('getIsPasswordValid with valid password with success', () => {
    const password: string = 'Valid@123';

    const result: boolean = getIsPasswordValid(password);

    expect(result).toBe(true);
  });

  it('getIsPasswordValid with invalid password with less then min length with success', () => {
    const password: string = 'Va@123';

    const result: boolean = getIsPasswordValid(password);

    expect(result).toBe(false);
  });

  it('getIsPasswordValid with invalid password with more then max length with success', () => {
    const password: string = 'ValidPassword@123';

    const result: boolean = getIsPasswordValid(password);

    expect(result).toBe(false);
  });

  it('getIsPasswordValid with invalid password with missing number with success', () => {
    const password: string = 'ValidPassword@';

    const result: boolean = getIsPasswordValid(password);

    expect(result).toBe(false);
  });

  it('getIsPasswordValid with invalid password missing uppercase letter with success', () => {
    const password: string = 'valid@123';

    const result: boolean = getIsPasswordValid(password);

    expect(result).toBe(false);
  });

  it('getIsPasswordValid with invalid password missing lowercase letter with success', () => {
    const password: string = 'VALID@123';

    const result: boolean = getIsPasswordValid(password);

    expect(result).toBe(false);
  });

  it('getIsPasswordValid with invalid password missing special letter with success', () => {
    const password: string = 'Valid12345';

    const result: boolean = getIsPasswordValid(password);

    expect(result).toBe(false);
  });
});
