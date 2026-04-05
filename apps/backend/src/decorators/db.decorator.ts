import { createParamDecorator, ExecutionContext, InternalServerErrorException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import type { Request } from 'express';
import type { PrismaClient } from 'generated/workspace-client/client';

type GraphQlContext = {
  req?: Request;
  db?: PrismaClient;
};

const Db = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const gqlCtx = GqlExecutionContext.create(ctx);
  const context = gqlCtx.getContext<GraphQlContext>();
  const db = context?.db;
  if (!db) {
    throw new InternalServerErrorException('--No database connection found--');
  }

  return db;
});

export default Db;
