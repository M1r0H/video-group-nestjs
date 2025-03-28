import { GroupExist } from '@modules/groups/decorators/groups-exist.decorator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl, MinLength } from 'class-validator';

export class VideosEditRequest {
  @ApiPropertyOptional({
    description: 'Updated title of the video',
    example: 'Updated title',
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  public title?: string;

  @ApiPropertyOptional({
    description: 'Updated video URL',
    example: 'https://example.com/updated.mp4',
  })
  @IsOptional()
  @IsUrl()
  public url?: string;

  @ApiPropertyOptional({
    description: 'Updated description of the video',
    example: 'Updated video description',
  })
  @IsOptional()
  @IsString()
  public description?: string;

  @ApiPropertyOptional({
    description: 'Updated group ID if the video is moved to another group',
    example: '2',
  })
  @IsOptional()
  @IsString()
  @GroupExist()
  public groupId?: string;
}
