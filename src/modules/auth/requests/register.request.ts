import { UserRole } from '@modules/users/constans';
import { UserEmailAlreadyRegistered } from '@modules/users/decorators/users-email-already-registered.decorator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterRequest {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email address of the user',
    required: true,
  })
  @IsEmail()
  @UserEmailAlreadyRegistered()
  public email: string;

  @ApiProperty({
    example: 'securePassword123',
    description: 'Password of the user',
    required: true,
  })
  @IsString()
  @MinLength(6)
  public password: string;

  @ApiProperty({
    example: UserRole.VIEWER,
    description: 'Role of the user',
    required: true,
    enum: UserRole,
  })
  @IsEnum(UserRole)
  public role: UserRole;

  @ApiProperty({
    example: 'John Doe',
    description: 'Name of the user',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public name: string;

  @ApiPropertyOptional({
    example: '+1234567890',
    description: 'Phone number of the user',
    required: false,
  })
  @IsOptional()
  @IsString()
  public phone?: string;

  @ApiPropertyOptional({
    example: '123 Main St',
    description: 'Address of the user',
    required: false,
  })
  @IsOptional()
  @IsString()
  public address?: string;

  @ApiPropertyOptional({
    example: 'New York',
    description: 'City of the user',
    required: false,
  })
  @IsOptional()
  @IsString()
  public city?: string;

  @ApiPropertyOptional({
    example: 'NY',
    description: 'State of the user',
    required: false,
  })
  @IsOptional()
  @IsString()
  public state?: string;

  @ApiPropertyOptional({
    example: '10001',
    description: 'Zip code of the user',
    required: false,
  })
  @IsOptional()
  @IsString()
  public zip?: string;
}
