import { HttpException, HttpStatus } from '@nestjs/common';
import { UserCreateRequest } from '@dtos';
import { INVALID_EMAIL_MESSAGE, INVALID_NAME_MESSAGE, INVALID_PASSWORD_MESSAGE } from '@constants';
import { UserCreateValidator } from './create.validator';

describe('UserCreateValidator Tests', () => {
  let validator: UserCreateValidator;

  beforeEach(() => {
    validator = new UserCreateValidator();
  });

  describe('validateCreateUserRequest', () => {
    it('should pass with valid user info', () => {
      const request: UserCreateRequest = new UserCreateRequest();
      request.name = 'Valid Name';
      request.email = 'valid.email@email.com';
      request.password = 'ValidPass@123';

      expect(() => {
        validator.validateCreateUserRequest(request);
      }).not.toThrow();
    });

    it('Should return invalid name message', () => {
      const request: UserCreateRequest = new UserCreateRequest();
      request.name = 'NomeDeTest';
      request.email = 'NomeDeTest';
      request.password = 'NomeDeTest';

      const httpError: HttpException = new HttpException(
        { status: HttpStatus.BAD_REQUEST, error: INVALID_NAME_MESSAGE },
        HttpStatus.BAD_REQUEST,
      );

      expect(() => {
        validator.validateCreateUserRequest(request);
      }).toThrow(httpError);
    });

    it('Should return invalid email message', () => {
      const request: UserCreateRequest = new UserCreateRequest();
      request.name = 'Valid Name';
      request.email = 'invalidEmail';
      request.password = 'somePassword';

      const httpError: HttpException = new HttpException(
        { status: HttpStatus.BAD_REQUEST, error: INVALID_EMAIL_MESSAGE },
        HttpStatus.BAD_REQUEST,
      );

      expect(() => {
        validator.validateCreateUserRequest(request);
      }).toThrow(httpError);
    });

    it('Should return invalid password message', () => {
      const request: UserCreateRequest = new UserCreateRequest();
      request.name = 'Valid Name';
      request.email = 'valid.email@email.com';
      request.password = 'invalidpassword';

      const httpError: HttpException = new HttpException(
        { status: HttpStatus.BAD_REQUEST, error: INVALID_PASSWORD_MESSAGE },
        HttpStatus.BAD_REQUEST,
      );

      expect(() => {
        validator.validateCreateUserRequest(request);
      }).toThrow(httpError);
    });
  });
});
