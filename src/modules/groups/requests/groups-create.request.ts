import { GroupExist } from '@modules/groups/decorators/groups-exist.decorator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

export class GroupsCreateRequest {
  @ApiProperty({
    description: 'The name of the group',
    example: 'Frontend Team',
  })
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  public name: string;

  @ApiPropertyOptional({
    description: 'Optional description of the group',
    example: 'Team for frontend developers',
  })
  @IsOptional()
  @IsString()
  public description?: string;

  @ApiPropertyOptional({
    description:
      'ID of the parent group if this group is nested for first group dont send this field',
  })
  @IsOptional()
  @IsUUID('4', { message: 'Parent ID must be a valid UUID' })
  @GroupExist()
  public parentId?: string;
}
