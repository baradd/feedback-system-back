import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class MariaExceptionFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const driverError = (exception as any).driverError;
    let status = HttpStatus.BAD_REQUEST;
    let errorMessage = 'Database error';

    if (driverError) {
      switch (driverError.errno) {
        case 1048: // Column cannot be null
          errorMessage = `Column '${driverError.sqlMessage.match(/Column '(.*?)'/)?.[1]}' cannot be null`;
          status = HttpStatus.BAD_REQUEST;
          break;

        case 1062: // Duplicate entry
          const duplicateMatch = driverError.message.match(
            /Duplicate entry '(.*?)' for key '(.*?)'/,
          );
          if (duplicateMatch) {
            errorMessage = `Duplicate entry '${duplicateMatch[1]}' for '${duplicateMatch[2]}'`;
          } else {
            errorMessage = 'Duplicate entry';
          }
          status = HttpStatus.CONFLICT;
          break;

        case 1054: // Unknown column
          errorMessage = `Unknown column: ${driverError.sqlMessage}`;
          status = HttpStatus.BAD_REQUEST;
          break;

        case 1146: // Table doesn't exist
          errorMessage = `Table not found: ${driverError.sqlMessage}`;
          status = HttpStatus.INTERNAL_SERVER_ERROR;
          break;

        case 1364: // Field doesn't have a default value
          errorMessage = driverError.message;
          status = HttpStatus.BAD_REQUEST;
          break;

        case 1451: // Cannot delete or update parent row: foreign key constraint fails
          errorMessage =
            'Cannot delete or update due to foreign key constraint';
          status = HttpStatus.CONFLICT;
          break;

        case 1452: // Cannot add or update a child row: foreign key constraint fails
          errorMessage = 'Foreign key constraint failed on insert/update';
          status = HttpStatus.BAD_REQUEST;
          break;

        default:
          errorMessage = driverError.message || 'Unhandled database error';
          status = HttpStatus.BAD_REQUEST;
          break;
      }
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      message: errorMessage,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
