import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class StripSensitiveFieldsInterceptor implements NestInterceptor {
  private readonly sensitiveFields = ['password'];
  private readonly skipFields = ['createdAt', 'updatedAt'];

  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(async (data) => {
        const resolvedData = await Promise.resolve(data);

        if (resolvedData && typeof resolvedData === 'object') {
          return this.removeSensitiveFields(resolvedData);
        }

        return resolvedData;
      }),
    );
  }

  private removeSensitiveFields(data: any): any {
    if (Array.isArray(data)) {
      return data.map((item) => this.removeSensitiveFields(item));
    }

    if (typeof data === 'object' && data !== null) {
      const cleanData = { ...data };

      for (const field of this.sensitiveFields) {
        if (field in cleanData) {
          delete cleanData[field];
        }
      }

      for (const key in cleanData) {
        if (this.skipFields.includes(key)) {
          continue;
        }

        if (
          cleanData[key] &&
          (typeof cleanData[key] === 'object' || Array.isArray(cleanData[key]))
        ) {
          cleanData[key] = this.removeSensitiveFields(cleanData[key]);
        }
      }

      return cleanData;
    }

    return data;
  }
}
