import { createParamDecorator, ExecutionContext, InternalServerErrorException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';

const Db = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const gqlCtx = GqlExecutionContext.create(ctx);
  const request: Request = gqlCtx.getContext<{ req: Request }>()?.req;

  if (!request?.db) {
    throw new InternalServerErrorException('No database connection found');
  }

  return request.db;
});

export default Db;
