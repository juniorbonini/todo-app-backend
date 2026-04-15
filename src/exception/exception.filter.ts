/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

import type {
  ApiErrorResponse,
  ApiFieldError,
} from '@/interfaces/api-response';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse() as
        | string
        | {
            message?: string | string[];
            code?: string;
            field?: string;
            errors?: ApiFieldError[];
            status?: 'error';
          };

      const message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : Array.isArray(exceptionResponse.message)
            ? exceptionResponse.message[0]
            : exceptionResponse.message || exception.message;

      const responseBody: ApiErrorResponse = {
        status: 'error',
        message,
        code:
          typeof exceptionResponse === 'string'
            ? this.getDefaultCode(status)
            : exceptionResponse.code || this.getDefaultCode(status),
      };

      if (typeof exceptionResponse !== 'string' && exceptionResponse.field) {
        responseBody.field = exceptionResponse.field;
      }

      if (typeof exceptionResponse !== 'string' && exceptionResponse.errors) {
        responseBody.errors = exceptionResponse.errors;
      }

      response.status(status).json(responseBody);
      return;
    }

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: 'Erro interno do servidor.',
      code: 'INTERNAL_SERVER_ERROR',
    } satisfies ApiErrorResponse);
  }

  private getDefaultCode(status: number) {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return 'BAD_REQUEST';
      case HttpStatus.UNAUTHORIZED:
        return 'UNAUTHORIZED';
      case HttpStatus.NOT_FOUND:
        return 'NOT_FOUND';
      default:
        return 'HTTP_ERROR';
    }
  }
}
