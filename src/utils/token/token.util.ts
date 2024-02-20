export function getToken(token: string): string {
  if (!token) return '';

  const splittedToken: Array<string> = token.split(' ');
  const tokenWithoutBearer: string = splittedToken[1];

  if (!tokenWithoutBearer) return '';

  return tokenWithoutBearer;
}
