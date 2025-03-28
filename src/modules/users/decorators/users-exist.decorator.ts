import { UsersService } from '@modules/users/services/users.service';
import { Inject, Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator';

@Injectable()
@ValidatorConstraint({ async: true })
export class IsUserExist implements ValidatorConstraintInterface {
  @Inject(UsersService)
  private readonly usersService: UsersService

  public async validate(email: string): Promise<boolean> {
    return this.usersService
      .oneByEmail(email)
      .then((user) => !!user);
  }

  public defaultMessage(): string {
    return 'User already exists';
  }
}

export function UserExist(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string): void {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUserExist,
    });
  };
}
