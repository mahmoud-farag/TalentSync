import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './filters/global-exception.filter';
import { LoggingInterceptor } from './interceptors';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  try {
    const app = await NestFactory.create(AppModule, {
      bufferLogs: true,
    });

    app.useLogger(process.env.NODE_ENV === 'production' ? ['log', 'warn', 'error'] : ['log', 'warn', 'error', 'debug', 'verbose']);

    const frontendOrigin = process.env.FRONTEND_ORIGIN ?? 'http://localhost:5173';
    // app.setGlobalPrefix('api');
    app.enableCors({
      origin: frontendOrigin,
      credentials: true,
    });

    app.useGlobalFilters(new GlobalExceptionFilter());
    app.useGlobalInterceptors(new LoggingInterceptor());

    await app.listen(process.env.PORT ?? 3000);
    logger.log(`Application is listening on port ${process.env.PORT ?? 3000}`);
  } catch (error) {
    const startupError = error instanceof Error ? error : new Error('Application bootstrap failed.');

    logger.error(`Application failed to start: ${startupError.message}`, startupError.stack);
    process.exit(1);
  }
}

void bootstrap();
