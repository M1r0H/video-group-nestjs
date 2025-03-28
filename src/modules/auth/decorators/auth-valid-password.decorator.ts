import { UsersService } from '@modules/users/services/users.service';
import { Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@Injectable()
@ValidatorConstraint({ async: true })
export class IsValidPassword implements ValidatorConstraintInterface {
  @Inject(UsersService)
  private readonly usersService: UsersService;

  public async validate(
    password: string,
    data: ValidationArguments,
  ): Promise<boolean> {
    const { email } = data.object as { email: string };

    const user = await this.usersService.oneByEmail(email);

    if (!password || !user?.password) {
      return false;
    }

    return bcrypt.compare(password, user.password);
  }
}

export function ValidPassword(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string): void {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidPassword,
    });
  };
}
