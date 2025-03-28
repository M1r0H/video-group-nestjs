import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ContextId, ContextIdFactory } from '@nestjs/core';
import { Request } from 'express';
import { Dictionary, ParamsDictionary, Query } from 'express-serve-static-core';

@Injectable()
export abstract class BaseGuard<
  ReqParams = ParamsDictionary,
  ReqBody = Dictionary<unknown>,
  ReqQuery = Query,
> implements CanActivate {
  protected contextId: ContextId;
  protected request: Request<ReqParams, null, ReqBody, ReqQuery>;

  public abstract process(context: ExecutionContext): Promise<boolean> | boolean;

  public canActivate(context: ExecutionContext): Promise<boolean> | boolean {
    this.request = context.switchToHttp().getRequest();
    this.contextId = ContextIdFactory.getByRequest(this.request);

    return this.process(context);
  }

  protected error(
    message?: string,
    status = HttpStatus.BAD_REQUEST,
  ): never {
    throw new HttpException(message ? message : 'core.guards.message', status);
  }
}
