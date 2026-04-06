import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { GqlArgumentsHost } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import type { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const requestMeta = this.getRequestMeta(host);
    const errorResponse = this.buildErrorResponse(exception, requestMeta);

    this.logger.error(`${errorResponse.method} ${errorResponse.path} -> ${errorResponse.statusCode} ${errorResponse.message}`, exception instanceof Error ? exception.stack : undefined);

    if (host.getType<string>() === 'graphql') {
      throw new GraphQLError(errorResponse.message, {
        extensions: {
          code: errorResponse.error,
          statusCode: errorResponse.statusCode,
          timestamp: errorResponse.timestamp,
          path: errorResponse.path,
        },
      });
    }

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(errorResponse.statusCode).json(errorResponse);
  }

  private buildErrorResponse(exception: unknown, requestMeta: { path: string; method: string }) {
    const timestamp = new Date().toISOString();

    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      const statusCode = exception.getStatus();

      return {
        statusCode,
        timestamp,
        path: requestMeta.path,
        method: requestMeta.method,
        message: this.getExceptionMessage(response, exception.message),
        error: exception.name,
      };
    }

    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      timestamp,
      path: requestMeta.path,
      method: requestMeta.method,
      message: exception instanceof Error ? exception.message : 'Internal server error',
      error: 'InternalServerError',
    };
  }

  private getExceptionMessage(response: string | object, fallbackMessage: string): string {
    if (typeof response === 'string') {
      return response;
    }

    if (response && typeof response === 'object' && 'message' in response && typeof response.message === 'string') {
      return response.message;
    }

    if (response && typeof response === 'object' && 'message' in response && Array.isArray(response.message)) {
      return response.message.join(', ');
    }

    return fallbackMessage;
  }

  private getRequestMeta(host: ArgumentsHost): { path: string; method: string } {
    if (host.getType<string>() === 'graphql') {
      const gqlHost = GqlArgumentsHost.create(host);
      const context = gqlHost.getContext<{ req?: Request }>();

      return {
        path: context?.req?.url || '/graphql',
        method: context?.req?.method || 'POST',
      };
    }

    const request = host.switchToHttp().getRequest<Request>();

    return {
      path: request?.url || '',
      method: request?.method || '',
    };
  }
}
