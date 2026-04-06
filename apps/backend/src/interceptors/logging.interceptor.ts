import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import type { GraphQLResolveInfo } from 'graphql';
import type { Request } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const startedAt = Date.now();
    const requestMeta = this.getRequestMeta(context);

    this.logger.log(`Incoming ${requestMeta.type} ${requestMeta.label}`);

    return next.handle().pipe(
      tap({
        next: () => {
          this.logger.log(`Completed ${requestMeta.type} ${requestMeta.label} in ${Date.now() - startedAt}ms`);
        },
        error: (error: unknown) => {
          const message = error instanceof Error ? error.message : 'Unknown request error';

          this.logger.warn(`Failed ${requestMeta.type} ${requestMeta.label} in ${Date.now() - startedAt}ms: ${message}`);
        },
      }),
    );
  }

  private getRequestMeta(context: ExecutionContext): { type: 'HTTP' | 'GraphQL'; label: string } {
    if (context.getType<string>() === 'graphql') {
      const gqlContext = GqlExecutionContext.create(context);
      const request = gqlContext.getContext<{ req?: Request }>()?.req;
      const info = gqlContext.getInfo<GraphQLResolveInfo>();
      const operationName = info?.operation?.name?.value || info?.fieldName || 'anonymous';
      const hostname = request?.hostname || 'unknown-host';

      return {
        type: 'GraphQL',
        label: `${operationName} host=${hostname}`,
      };
    }

    const request = context.switchToHttp().getRequest<Request>();
    const method = request?.method || 'UNKNOWN';
    const path = request?.originalUrl || request?.url || '';
    const hostname = request?.hostname || 'unknown-host';

    return {
      type: 'HTTP',
      label: `${method} ${path} host=${hostname}`,
    };
  }
}
