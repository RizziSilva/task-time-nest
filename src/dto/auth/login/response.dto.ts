import { TokensDto } from './tokens.dto';

export class LoginResponseDto {
  name: string;
  email: string;
  token: TokensDto;
}
