import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Response } from 'express';
import { CustomRequest } from '@interfaces';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger: Logger = new Logger();

  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const response: Response = ctx.getResponse<Response>();
    const request: CustomRequest = ctx.getRequest<CustomRequest>();
    const status: number = exception.getStatus();
    const message: string = exception.message;

    this.logger.error(exception, [request.originalUrl, request.identifier]);

    response.status(status).json({
      message: message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
