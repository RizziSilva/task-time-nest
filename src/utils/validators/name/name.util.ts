export function getIsValidName(name: string) {
  return name && name.split(' ').length >= 2;
}
