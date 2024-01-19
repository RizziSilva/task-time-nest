import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserCreateRequest } from '@dtos';
import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  SPECIAL_CHARACTERS_REGEX,
  LETTER_REGEXP,
  UPPERCASE_LETTER_REGEXP,
  DIGIT_REGEXP,
  EMAIL_REGEXP,
  INVALID_NAME_MESSAGE,
  INVALID_EMAIL_MESSAGE,
  INVALID_PASSWORD_MESSAGE,
} from '@constants';

@Injectable()
export class UserCreateValidator {
  private getIsValidEmail(email: string): boolean {
    return EMAIL_REGEXP.test(email);
  }

  private getIsPasswordValid(password: string): boolean {
    if (!password) return false;

    const passwordLength: number = password.length;
    const hasCorrectLength: boolean =
      passwordLength <= PASSWORD_MAX_LENGTH && passwordLength >= PASSWORD_MIN_LENGTH;
    const hasSpecialCharacters = SPECIAL_CHARACTERS_REGEX.test(password);
    const hasLetter = LETTER_REGEXP.test(password);
    const hasUppercase = UPPERCASE_LETTER_REGEXP.test(password);
    const hasDigit = DIGIT_REGEXP.test(password);
    const isValid =
      hasCorrectLength && hasSpecialCharacters && hasLetter && hasUppercase && hasDigit;

    return isValid;
  }

  validateCreateUserRequest(request: UserCreateRequest): void {
    const { name, password, email }: UserCreateRequest = request;
    const hasValidName: boolean = name && name.split(' ').length >= 2;
    const hasValidPassword: boolean = this.getIsPasswordValid(password);
    const hasValidEmail: boolean = this.getIsValidEmail(email);
    const hasValidInformation: boolean = hasValidName && hasValidPassword && hasValidEmail;

    if (!hasValidInformation) {
      let message = '';

      if (!hasValidName) message = INVALID_NAME_MESSAGE;
      else if (!hasValidPassword) message = INVALID_EMAIL_MESSAGE;
      else if (!hasValidEmail) message = INVALID_PASSWORD_MESSAGE;

      throw new HttpException(
        { status: HttpStatus.BAD_REQUEST, error: message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
