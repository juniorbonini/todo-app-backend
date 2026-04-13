/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(BadRequestException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse() as any;

    let responseBody = {
      field: exceptionResponse.field || 'general',
      message: exceptionResponse.message || exception.message,
    };

    if (exceptionResponse.message?.includes('E-mail')) {
      responseBody = { field: 'email', message: 'E-mail já está em uso.' };
    } else if (exceptionResponse.message?.includes('senha')) {
      responseBody = { field: 'password', message: 'As senhas não coincidem.' };
    }

    response.status(status).json(responseBody);
  }
}
