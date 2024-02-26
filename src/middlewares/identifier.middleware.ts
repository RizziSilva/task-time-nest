import { Injectable, NestMiddleware } from '@nestjs/common';
import { randomBytes } from 'crypto';

@Injectable()
export class IdentifierMiddleware implements NestMiddleware {
  use(req: any, res: any, next: (error?: any) => void) {
    const uniqueIdentifier: string = randomBytes(16).toString('hex');

    req.identifier = uniqueIdentifier;

    next();
  }
}
