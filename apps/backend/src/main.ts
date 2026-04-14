import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './filters/global-exception.filter';
import { LoggingInterceptor } from './interceptors';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  try {

    const isDevelopment = process.env.NODE_ENV === 'development';
    const app = await NestFactory.create(AppModule, {
      bufferLogs: isDevelopment?  false : true,
    });

    app.useLogger(isDevelopment ? ['log', 'warn', 'error'] : ['log', 'warn', 'error', 'debug', 'verbose']);


    const frontendOrigin = isDevelopment ? ['http://localhost:5173', 'http://localhost1:5173', 'http://localhost2:5173'] :  [process.env.FRONTEND_ORIGIN] ;
    app.setGlobalPrefix('api');
    app.enableCors({
      origin: frontendOrigin,
      credentials: true,
    });

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
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
