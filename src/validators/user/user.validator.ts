import { Injectable } from '@nestjs/common';
import { UserCreateRequestDto } from '@dtos';
import { INVALID_NAME_MESSAGE, INVALID_EMAIL_MESSAGE, INVALID_PASSWORD_MESSAGE } from '@constants';
import { getIsPasswordValid, getIsValidEmail, getIsValidName } from '@utils';
import { UserUpdateRequestDto } from 'src/dto/user';
import { CreateUserException, UpdateException } from '@exceptions';

@Injectable()
export class UserValidator {
  validateCreateUserRequest(request: UserCreateRequestDto): void {
    const { name, password, email }: UserCreateRequestDto = request;
    const hasValidName: boolean = getIsValidName(name);
    const hasValidPassword: boolean = getIsPasswordValid(password);
    const hasValidEmail: boolean = getIsValidEmail(email);
    const hasValidInformation: boolean = hasValidName && hasValidPassword && hasValidEmail;

    if (!hasValidInformation) {
      let message: string = '';

      if (!hasValidName) message = INVALID_NAME_MESSAGE;
      else if (!hasValidPassword) message = INVALID_EMAIL_MESSAGE;
      else if (!hasValidEmail) message = INVALID_PASSWORD_MESSAGE;

      throw new CreateUserException(message);
    }
  }

  validateUserUpdateRequest(request: UserUpdateRequestDto): void {
    const { email, name } = request;
    const isValidEmail: boolean = !email || getIsValidEmail(email);
    const isValidName: boolean = !name || getIsValidName(name);
    const hasValidInfo: boolean = isValidEmail && isValidName;

    if (!hasValidInfo) {
      let errorMessage: string = '';

      if (!isValidEmail) errorMessage = INVALID_EMAIL_MESSAGE;
      if (!isValidName) errorMessage = INVALID_NAME_MESSAGE;

      throw new UpdateException(errorMessage);
    }
  }
}
