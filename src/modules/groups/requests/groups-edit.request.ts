import { GroupExist } from '@modules/groups/decorators/groups-exist.decorator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GroupsEditRequest {
  @ApiPropertyOptional({
    description: 'New name of the group',
    example: 'Updated Group Name',
  })
  @IsOptional()
  @IsString()
  public name?: string;

  @ApiPropertyOptional({
    description: 'Updated description of the group',
    example: 'Updated group description',
  })
  @IsOptional()
  @IsString()
  public description?: string;

  @ApiPropertyOptional({
    description: 'Updated parent group ID if changed',
    example: '2',
  })
  @IsOptional()
  @IsString()
  @GroupExist()
  public parentId?: string;
}
