import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RequestInfo, CustomRequest } from '@interfaces';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  constructor(private logger: Logger) {}

  private log(message: string, identifier: string): void {
    this.logger.log(`[${identifier}]: ${message}`);
  }

  private getMessageFromParameters(parameters: [string, unknown][]): string {
    const parametersMessage: string = parameters.reduce((accumulator, [key, value], index) => {
      const parametersValueAsString: string = JSON.stringify(value);
      const isFirst: boolean = index === 0;
      const parameterMessagePrefix: string = isFirst ? '' : ' - ';

      return accumulator + `${parameterMessagePrefix}${key}: ${parametersValueAsString}`;
    }, '');

    return parametersMessage;
  }

  private getEndpointInfo(request: Request): RequestInfo {
    const endpointMessage: string = `Request para o endpoint ${request.baseUrl}. Method: ${request.method}`;
    let parametersMessage: string = 'Paramêtros recebidos na request: ';
    const bodyParameters: [string, unknown][] = Object.entries(request.body);
    const queryParameters: [string, unknown][] = Object.entries(request.query);
    const hasBody: boolean = bodyParameters.length !== 0;
    const hasQueryParameters: boolean = queryParameters.length !== 0;

    if (hasBody) parametersMessage = this.getMessageFromParameters(bodyParameters);
    if (hasQueryParameters) parametersMessage = this.getMessageFromParameters(queryParameters);

    return { endpointMessage, parametersMessage };
  }

  use(req: CustomRequest, res: Response, next: NextFunction) {
    const requestInfo: RequestInfo = this.getEndpointInfo(req);

    this.log(requestInfo.endpointMessage, req.identifier);
    this.log(requestInfo.parametersMessage, req.identifier);

    next();
  }
}
