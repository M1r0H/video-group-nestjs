import { HttpException, HttpStatus } from '@nestjs/common';

export class ValidationException extends HttpException {
  public messages: string | Record<string, unknown> | Record<string, unknown>[];

  public constructor(response: string | Record<string, unknown> | Record<string, unknown>[]) {
    super(response, HttpStatus.BAD_REQUEST);

    this.messages = response;
  }
}
