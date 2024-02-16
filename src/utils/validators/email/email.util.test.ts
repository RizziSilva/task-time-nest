import { getIsValidEmail } from './email.util';

describe('Email utils tests', () => {
  it('getIsValidEmail with valid email with Success', () => {
    const email: string = 'valid.email@email.com';

    const result: boolean = getIsValidEmail(email);

    expect(result).toBe(true);
  });

  it('getIsValidEmail with missing @ char with Success', () => {
    const email: string = 'valid.emailemail.com';

    const result: boolean = getIsValidEmail(email);

    expect(result).toBe(false);
  });

  it('getIsValidEmail with missing email prefix with Success', () => {
    const email: string = '@email';

    const result: boolean = getIsValidEmail(email);

    expect(result).toBe(false);
  });
});
