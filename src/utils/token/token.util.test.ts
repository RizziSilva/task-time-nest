import { getToken } from './token.util';

describe('Token util tests', () => {
  describe('getToken tests', () => {
    it('Get token removing bearer with success', () => {
      const tokenSufix: string = '78945612';
      const token: string = `Bearer ${tokenSufix}`;

      const result: string = getToken(token);

      expect(result).toEqual(tokenSufix);
    });

    it('Get token without bearer prefix returning empty string', () => {
      const tokenSufix: string = '78945612';
      const token: string = tokenSufix;

      const result: string = getToken(token);

      expect(result).toMatch('');
    });
  });
});
