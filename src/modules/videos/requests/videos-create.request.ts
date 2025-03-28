import { GroupExist } from '@modules/groups/decorators/groups-exist.decorator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUrl, MinLength } from 'class-validator';

export class VideosCreateRequest {
  @ApiProperty({
    description: 'Title of the video',
    example: 'NestJS Crash Course',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  public title: string;

  @ApiProperty({
    description: 'URL of the video resource',
    example: 'https://example.com/video.mp4',
  })
  @IsNotEmpty()
  @IsUrl()
  public url: string;

  @ApiPropertyOptional({
    description: 'Optional description of the video',
    example: 'A quick intro to NestJS',
  })
  @IsOptional()
  @IsString()
  public description?: string;

  @ApiPropertyOptional({
    description: 'ID of the group to which the video belongs',
    example: '3',
  })
  @IsOptional()
  @IsString()
  @GroupExist()
  public groupId?: string;
}
