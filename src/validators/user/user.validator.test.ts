import { UserCreateRequestDto, UserUpdateRequestDto } from '@dtos';
import { CreateUserException, UpdateException } from '@exceptions';
import { UserValidator } from './user.validator';
import { INVALID_EMAIL_MESSAGE, INVALID_NAME_MESSAGE, INVALID_PASSWORD_MESSAGE } from '@constants';

describe('UserValidator Tests', () => {
  let validator: UserValidator;

  beforeEach(() => {
    validator = new UserValidator();
  });

  describe('validateCreateUserRequest', () => {
    it('should pass with valid user info', () => {
      const request: UserCreateRequestDto = new UserCreateRequestDto();
      request.name = 'Valid Name';
      request.email = 'valid.email@email.com';
      request.password = 'ValidPass@123';

      const act: Function = () => {
        validator.validateCreateUserRequest(request);
      };

      expect(act).not.toThrow();
    });

    it('Should return invalid name message', () => {
      const request: UserCreateRequestDto = new UserCreateRequestDto();
      request.name = 'NomeDeTest';
      request.email = 'NomeDeTest';
      request.password = 'NomeDeTest';

      const act: Function = () => {
        validator.validateCreateUserRequest(request);
      };

      expect(act).toThrow(CreateUserException);
      expect(act).toThrow(INVALID_NAME_MESSAGE);
    });

    it('Should return invalid email message', () => {
      const request: UserCreateRequestDto = new UserCreateRequestDto();
      request.name = 'Valid Name';
      request.email = 'invalidEmail';
      request.password = 'ValidPass@123';

      const act: Function = () => {
        validator.validateCreateUserRequest(request);
      };

      expect(act).toThrow(CreateUserException);
      expect(act).toThrow(INVALID_EMAIL_MESSAGE);
    });

    it('Should return invalid password message for password without number', () => {
      const request: UserCreateRequestDto = new UserCreateRequestDto();
      request.name = 'Valid Name';
      request.email = 'valid.email@email.com';
      request.password = 'Invalid@pass';

      const act: Function = () => {
        validator.validateCreateUserRequest(request);
      };

      expect(act).toThrow(CreateUserException);
      expect(act).toThrow(INVALID_PASSWORD_MESSAGE);
    });

    it('Should return invalid password message for password without special caracter', () => {
      const request: UserCreateRequestDto = new UserCreateRequestDto();
      request.name = 'Valid Name';
      request.email = 'valid.email@email.com';
      request.password = 'Invalidpass123';

      const act: Function = () => {
        validator.validateCreateUserRequest(request);
      };

      expect(act).toThrow(CreateUserException);
      expect(act).toThrow(INVALID_PASSWORD_MESSAGE);
    });

    it('Should return invalid password message for password without uppercase letter', () => {
      const request: UserCreateRequestDto = new UserCreateRequestDto();
      request.name = 'Valid Name';
      request.email = 'valid.email@email.com';
      request.password = 'invalidpass@123';

      const act: Function = () => {
        validator.validateCreateUserRequest(request);
      };

      expect(act).toThrow(CreateUserException);
      expect(act).toThrow(INVALID_PASSWORD_MESSAGE);
    });

    it('Should return invalid password message for password without lowercase letter', () => {
      const request: UserCreateRequestDto = new UserCreateRequestDto();
      request.name = 'Valid Name';
      request.email = 'valid.email@email.com';
      request.password = 'INVALID@PASS123';

      const act: Function = () => {
        validator.validateCreateUserRequest(request);
      };

      expect(act).toThrow(CreateUserException);
      expect(act).toThrow(INVALID_PASSWORD_MESSAGE);
    });
  });

  describe('validateUserUpdateRequest Tests', () => {
    it('Validate user with invalid email throw error', () => {
      const request: UserUpdateRequestDto = {
        email: 'invalidemail',
        name: 'Test Name',
      };

      const act: Function = () => {
        validator.validateUserUpdateRequest(request);
      };

      expect(act).toThrow(UpdateException);
      expect(act).toThrow(INVALID_EMAIL_MESSAGE);
    });

    it('Validate user with invalid name throw error', () => {
      const request: UserUpdateRequestDto = {
        email: 'email@email.com',
        name: 'Test',
      };

      const act: Function = () => {
        validator.validateUserUpdateRequest(request);
      };

      expect(act).toThrow(UpdateException);
      expect(act).toThrow(INVALID_NAME_MESSAGE);
    });

    it('Validate user with valid info', () => {
      const request: UserUpdateRequestDto = {
        email: 'email@email.com',
        name: 'Test Name',
      };

      const act: Function = () => {
        validator.validateUserUpdateRequest(request);
      };

      expect(act).not.toThrow(UpdateException);
    });
  });
});
