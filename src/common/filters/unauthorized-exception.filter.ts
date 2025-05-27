import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  UnauthorizedException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    console.log(
      'UnauthorizedExceptionFilter caught an exception:',
      exception.message,
    );

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    response.status(HttpStatus.UNAUTHORIZED).json({
      success: false,
      statusCode: HttpStatus.UNAUTHORIZED,
      message: 'Unauthorized',
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
