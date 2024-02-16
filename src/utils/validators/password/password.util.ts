import {
  DIGIT_REGEXP,
  LETTER_REGEXP,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  SPECIAL_CHARACTERS_REGEX,
  UPPERCASE_LETTER_REGEXP,
} from '@constants';

export function getIsPasswordValid(password: string): boolean {
  if (!password) return false;

  const passwordLength: number = password.length;
  const hasCorrectLength: boolean =
    passwordLength <= PASSWORD_MAX_LENGTH && passwordLength >= PASSWORD_MIN_LENGTH;
  const hasSpecialCharacters = SPECIAL_CHARACTERS_REGEX.test(password);
  const hasLetter = LETTER_REGEXP.test(password);
  const hasUppercase = UPPERCASE_LETTER_REGEXP.test(password);
  const hasDigit = DIGIT_REGEXP.test(password);
  const isValid = hasCorrectLength && hasSpecialCharacters && hasLetter && hasUppercase && hasDigit;

  return isValid;
}
