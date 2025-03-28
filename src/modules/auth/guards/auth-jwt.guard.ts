import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { AuthTokensService } from '../services/auth-tokens.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  public constructor(
    private readonly moduleRef: ModuleRef,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);

    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers['authorization'];

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid authorization header');
    }

    const tokenValue = authHeader.split(' ')[1];

    if (!tokenValue) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = await this.moduleRef.get(AuthTokensService, {
      strict: false,
    }).oneByToken(tokenValue, ['user']);

    if (!token || token.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid credentials');
    }

    request.user = {
      id: token.user.id,
      name: token.user.name,
      email: token.user.email,
      role: token.user.role,
    };

    return true;
  }
}
