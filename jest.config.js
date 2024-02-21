/** @type {import('ts-jest').JestConfigWithTsJest} */

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  moduleNameMapper: {
    '@modules': '<rootDir>/src/modules',
    '@entities': '<rootDir>/src/entities',
    '@dtos': '<rootDir>/src/dto',
    '@controllers': '<rootDir>/src/controllers',
    '@services': '<rootDir>/src/services',
    '@mappers': '<rootDir>/src/mappers',
    '@validators': '<rootDir>/src/validators',
    '@constants': '<rootDir>/src/constants',
    '@decorators': '<rootDir>/src/decorators',
    '@guards': '<rootDir>/src/guards',
    '@exceptions': '<rootDir>/src/exceptions',
    '@utils': '<rootDir>/src/utils',
    '@middlewares': '<rootDir>/src/middlewares',
    '@interfaces': '<rootDir>/src/interfaces',
    '@filters': '<rootDir>/src/filters',
  },
};
