import { GroupsService } from '@modules/groups/services/groups.service';
import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class PreventCircularGroupGuard implements CanActivate {
  constructor(private readonly groupsService: GroupsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const method = request.method;
    const parentId = request.body?.parentId;

    if (!parentId) {
      return true;
    }

    switch (method) {
      case 'POST':
        if (request.body?.id && parentId === request.body.id) {
          throw new BadRequestException('Group cannot be its own parent');
        }

        return true;

      case 'PATCH':
        const groupId = request.params.id;

        if (!groupId) {
          return true;
        }

        if (groupId === parentId) {
          throw new BadRequestException('Group cannot be its own parent');
        }

        const descendants = await this.groupsService.getDescendantsIds(groupId);

        if (descendants.includes(parentId)) {
          throw new BadRequestException('Circular reference detected');
        }

        return true;

      default:
        return true;
    }
  }
}
