import { LoginRequest } from '@modules/auth/requests/login.request';
import { RegisterRequest } from '@modules/auth/requests/register.request';
import { AuthService } from '@modules/auth/services/auth.service';
import { ResponseInterface } from '@modules/auth/types/controller.types';
import { UsersService } from '@modules/users/services/users.service';
import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateToken } from '@modules/auth/decorators/auth-create-token.decorator';
import { CreateTokenInterceptor } from '@modules/auth/interceptors/create-token.interceptor';

@ApiTags('Auth')
@UseInterceptors(CreateTokenInterceptor)
@Controller('auth')
export class AuthController {
  public constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {
  }

  @Post('/registration')
  @CreateToken()
  @ApiBody({ type: RegisterRequest })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  public async signUp(
    @Body() body: RegisterRequest,
  ): Promise<ResponseInterface> {
    const password = await this.authService.hashedPassword(body.password);

    return {
      user: await this.usersService.create({
        ...body,
        password,
      }),
    };
  }

  @Post('/')
  @CreateToken()
  @ApiBody({ type: LoginRequest })
  @ApiResponse({ status: 200, description: 'User logged in successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  public async signIn(@Body() body: LoginRequest): Promise<ResponseInterface> {
    return {
      user: await this.usersService.oneByEmail(body.email),
    };
  }
}
