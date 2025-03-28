import { Injectable, ValidationError, ValidationPipe } from '@nestjs/common';
import { ValidationException } from '@src/core/exceptions/validation.exception';

@Injectable()
export class CustomValidationPipe extends ValidationPipe {
  public constructor() {
    super({
      transform: true,
      transformOptions: {
        enableImplicitConversion: false,
        exposeUnsetFields: false,
      },
      whitelist: true,
      forbidUnknownValues: true,
      forbidNonWhitelisted: true,
      stopAtFirstError: true,
      exceptionFactory: (errors: ValidationError[] = []) => {
        const fields = errors.reduce((acc, error) => {
          if (error.property === 'password') {
            return acc;
          }

          const extractConstraints = (error: ValidationError): string[] => {
            let messages: string[] = [];

            if (error.constraints) {
              messages = [...messages, ...Object.values(error.constraints)];
            }

            if (error.children?.length) {
              for (const child of error.children) {
                messages = [...messages, ...extractConstraints(child)];
              }
            }

            return messages;
          };

          return {
            ...acc,
            [error.property]: extractConstraints(error),
          };
        }, {});

        throw new ValidationException({
          name: 'validation',
          message: 'Bad Request',
          ...(Object.keys(fields).length && { fields }),
        });
      },
    });
  }
}
