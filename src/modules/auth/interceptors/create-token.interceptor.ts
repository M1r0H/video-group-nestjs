import { CREATE_TOKEN_KEY } from '@modules/auth/decorators/auth-create-token.decorator';
import { AuthTokensService } from '@modules/auth/services/auth-tokens.service';
import { GenerateTokenParams } from '@modules/auth/types/controller.types';
import { User } from '@modules/users/entities/user.entity';
import { UsersService } from '@modules/users/services/users.service';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Observable, map } from 'rxjs';

@Injectable()
export class CreateTokenInterceptor implements NestInterceptor {
  public constructor(
    private readonly reflector: Reflector,
    private readonly tokenService: AuthTokensService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) { }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const shouldCreateToken = this.reflector.get<boolean>(
      CREATE_TOKEN_KEY,
      context.getHandler(),
    );

    if (!shouldCreateToken) {
      return next.handle();
    }

    return next.handle().pipe(
      map(async (responseData: { user: User }) => {
        const token = await this.tokenService.createToken({
          userId: responseData.user.id,
          type: 'auth',
          expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000),
          token: this.getAuthTokenString({ user: responseData.user, expiry: '1h' }),
        });

        const { password, ...rest } = responseData.user;

        return {
          ...rest,
          token: token.token,
        };
      }),
    );
  }

  private getAuthTokenString({ user, expiry }: GenerateTokenParams): string {
    return this.jwtService.sign({
      id: user?.id,
      email: user?.email,
      name: user?.name,
      type: 'auth',
    },
      { expiresIn: expiry }
    );
  }
}
