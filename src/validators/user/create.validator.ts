import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserCreateRequestDto } from '@dtos';
import { INVALID_NAME_MESSAGE, INVALID_EMAIL_MESSAGE, INVALID_PASSWORD_MESSAGE } from '@constants';
import { getIsPasswordValid, getIsValidEmail } from '@utils';
import { UserUpdateRequestDto } from 'src/dto/user';
import { UpdateException } from '@exceptions';

@Injectable()
export class UserValidator {
  validateCreateUserRequest(request: UserCreateRequestDto): void {
    const { name, password, email }: UserCreateRequestDto = request;
    const hasValidName: boolean = name && name.split(' ').length >= 2;
    const hasValidPassword: boolean = getIsPasswordValid(password);
    const hasValidEmail: boolean = getIsValidEmail(email);
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

  validateUserUpdateRequest(request: UserUpdateRequestDto): void {
    const { email, name } = request;
    const isValidEmail = getIsValidEmail(email);
    const isValidName = name && name.split(' ').length >= 2;
    const hasValidInfo = isValidEmail && isValidName;

    if (!hasValidInfo) {
      let errorMessage = '';

      if (!isValidEmail) errorMessage = INVALID_EMAIL_MESSAGE;
      if (!isValidName) errorMessage = INVALID_NAME_MESSAGE;

      throw new UpdateException(errorMessage);
    }
  }
}
