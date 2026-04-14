import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ValidationError } from 'class-validator';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './exception/exceptio.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors: ValidationError[]) => {
        const firstError = errors[0];
        const firstConstraint = firstError?.constraints
          ? Object.values(firstError.constraints)[0]
          : 'Dados inválidos.';

        return new BadRequestException({
          status: 'error',
          message: firstConstraint,
          code: 'VALIDATION_ERROR',
          field: firstError?.property,
        });
      },
    }),
  );
  app.enableCors();
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
