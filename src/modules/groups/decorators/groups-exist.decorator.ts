import { GroupsService } from '@modules/groups/services/groups.service';
import { Inject, Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@Injectable()
@ValidatorConstraint({ async: true })
export class IsGroupExist implements ValidatorConstraintInterface {
  @Inject(GroupsService)
  private readonly groupsService: GroupsService;

  public async validate(groupId: string): Promise<boolean> {
    if (!groupId) {
      return true;
    }

    return this.groupsService
      .one(groupId)
      .then((group) => !!group);
  }

  public defaultMessage(args: ValidationArguments): string {
    return `Group with id ${args.value} not found`;
  }
}

export function GroupExist(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string): void {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsGroupExist,
    });
  };
}
