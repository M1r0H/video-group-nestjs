import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class VideosListQueryRequest {
  @ApiPropertyOptional({
    description: 'Filter videos by the title',
    example: 'Video title',
  })
  @IsOptional()
  @IsString()
  public title?: string;

  @ApiPropertyOptional({
    description: 'Search videos by the title or description',
    example: 'Video title',
  })
  @IsOptional()
  @IsString()
  public search?: string;

  @ApiPropertyOptional({
    description: 'Filter videos by the group they belong to',
    example: '1',
  })
  @IsOptional()
  @IsUUID()
  public groupId?: string;

  @ApiPropertyOptional({
    description: 'Page number',
    example: 1,
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @Min(1)
  public page?: number;

  @ApiPropertyOptional({
    description: 'Number of videos per page',
    example: 10,
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @Min(1)
  public perPage?: number;
}
