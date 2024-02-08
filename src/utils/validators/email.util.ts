import { EMAIL_REGEXP } from '@constants';

export function getIsValidEmail(email: string): boolean {
  return EMAIL_REGEXP.test(email);
}
