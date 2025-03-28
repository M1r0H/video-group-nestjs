import { BaseGuard } from '@core/guards/base.guard';
import { GroupsService } from '@modules/groups/services/groups.service';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';

@Injectable()
export class GroupNotFoundGuard extends BaseGuard<{ id: string }> {
  @Inject(GroupsService)
  private groupsService: GroupsService;

  public async process(): Promise<boolean> {
    const id = this.request.params.id;

    if (!id) {
      this.error('Invalid group ID');
    }

    const group = await this.groupsService.one(id).catch(() => null);

    if (!group) {
      this.error(`Group with ID ${id} not found`, HttpStatus.NOT_FOUND);
    }

    return true;
  }
}
