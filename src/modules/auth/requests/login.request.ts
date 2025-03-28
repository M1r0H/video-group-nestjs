import { ValidPassword } from '@modules/auth/decorators/auth-valid-password.decorator';
import { UserExist } from '@modules/users/decorators/users-exist.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginRequest {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email address of the user',
    required: true,
  })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  @UserExist({ message: 'Invalid credentials' })
  public email: string;

  @ApiProperty({
    example: 'securePassword123',
    description: 'Password of the user',
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @ValidPassword()
  public password: string;
}
