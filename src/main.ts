/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ValidationError } from 'class-validator';

import type { ApiFieldError } from '@/interfaces/api-response';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './exception/exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors: ValidationError[]) => {
        const validationErrors = buildValidationErrors(errors);
        const firstError = validationErrors[0];

        return new BadRequestException({
          status: 'error',
          message: firstError?.message || 'Dados inválidos.',
          code: 'VALIDATION_ERROR',
          field: firstError?.field,
          errors: validationErrors,
        });
      },
    }),
  );
  app.enableCors();
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

function buildValidationErrors(errors: ValidationError[]): ApiFieldError[] {
  return errors.flatMap((error) => {
    const constraints = error.constraints
      ? Object.values(error.constraints).map((message) => ({
          field: error.property,
          message,
          code: 'VALIDATION_ERROR',
        }))
      : [];

    const children = error.children?.length
      ? buildValidationErrors(error.children)
      : [];

    return [...constraints, ...children];
  });
}
