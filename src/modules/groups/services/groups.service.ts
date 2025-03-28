import { Group } from '@modules/groups/entities/group.entity';
import { GetAllParams, GroupCreateParams, GroupEditParams } from '@modules/groups/types/service.types';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { filter, map } from 'lodash';
import { IsNull, TreeRepository } from 'typeorm';
import { ResponseInterface } from '@core/types/types';

@Injectable()
export class GroupsService {
  @InjectRepository(Group)
  private readonly groupsTreeRepository: TreeRepository<Group>;

  public async all(params: GetAllParams): Promise<ResponseInterface<Group>> {
    const { name, parentId } = params;
    const query = this.groupsTreeRepository
      .createQueryBuilder('group')
      .leftJoinAndSelect('group.children', 'children')
      .leftJoinAndSelect('group.parent', 'parent')
      .leftJoinAndSelect('group.videos', 'videos');

    if (name) {
      query.andWhere('group.name ILIKE :name', { name: `%${name}%` });
    }

    if (parentId) {
      query.andWhere('parent.id = :parentId', { parentId });
    }

    const [list, total] = await query.getManyAndCount();

    return {
      data: list,
      total,
    };
  }

  public async getPaginatedTree(
    page: number,
    limit: number,
  ): Promise<ResponseInterface<Group>> {
    const [roots, total] = await this.groupsTreeRepository.findAndCount({
      where: { parent: IsNull() },
      skip: (page - 1) * limit,
      take: limit,
    });

    const trees = await Promise.all(
      roots.map((root) => this.groupsTreeRepository.findDescendantsTree(root)),
    );

    return {
      data: trees,
      total,
    };
  }

  public async one(id: string): Promise<Group | null> {
    return this.groupsTreeRepository.findOne({
      where: { id },
      relations: ['parent', 'children', 'videos'],
    });
  }

  public async create(params: GroupCreateParams): Promise<Group> {
    const { parentId, ...rest } = params;

    const parent = parentId
      ? await this.groupsTreeRepository.findOneBy({ id: parentId })
      : null;

    return await this.groupsTreeRepository.save({
      ...rest,
      parent,
    });
  }

  public async update(
    id: string,
    params: GroupEditParams,
  ): Promise<Group | null> {
    const { parentId, ...rest } = params;
    const group = await this.one(id);

    if (!group) {
      return null;
    }

    const parent = params.hasOwnProperty('parentId')
      ? parentId
        ? await this.one(parentId)
        : null
      : group.parent;

    return this.groupsTreeRepository.save({
      ...group,
      ...rest,
      parent,
    });
  }

  public async remove(id: string): Promise<void> {
    const group = await this.one(id);

    if (!group) {
      return;
    }

    if (group.children && group.children.length) {
      for (const child of group.children) {
        child.parent = null;

        await this.groupsTreeRepository.save(child);
      }
    }

    await this.groupsTreeRepository.remove(group);
  }

  public async getDescendantsIds(id: string): Promise<string[]> {
    const group = await this.groupsTreeRepository.findOne({
      where: { id },
    });

    if (!group) {
      return [];
    }

    const tree = await this.groupsTreeRepository.findDescendants(group);

    return filter(
      map(tree, (g) => g.id),
      (childId) => childId !== id,
    );
  }
}
