import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { dbConfig, serverConfig } from 'config';
import { CompanyModule } from './company/company.module';
import { CompanyContextMiddleware } from './company/infrastructure/http/company-context.middleware';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV || 'development'}`],
      load: [dbConfig, serverConfig],
    }),
    PrismaModule,
    CompanyModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CompanyContextMiddleware).forRoutes('*');
  }
}
