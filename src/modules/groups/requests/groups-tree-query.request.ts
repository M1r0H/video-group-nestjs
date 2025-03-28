import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive } from 'class-validator';

export class GroupsTreeQueryRequest {
  @ApiProperty({
    description: 'Page number',
    required: false,
    type: Number,
    default: 1,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Transform(({ obj, key }) => Number(obj[key]))
  public page: number;

  @ApiProperty({
    description: 'Limit',
    required: false,
    type: Number,
    default: 10,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Transform(({ obj, key }) => Number(obj[key]))
  public limit: number;
}
