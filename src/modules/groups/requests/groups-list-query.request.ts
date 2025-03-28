import { GroupExist } from '@modules/groups/decorators/groups-exist.decorator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GroupsListQueryRequest {
  @ApiPropertyOptional({
    description: 'Search groups by name (partial match)',
    example: 'frontend',
  })
  @IsOptional()
  @IsString()
  public name?: string;

  @ApiPropertyOptional({
    description: 'Filter groups by parent group ID',
    example: '1',
  })
  @IsOptional()
  @IsString()
  @GroupExist()
  public parentId?: string;
}
