import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CompanyModule } from './modules/company/company.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { CompanyContextMiddleware } from './Middlewares';
import { UserModule } from './modules/user/user.module';
import { GraphQlModule } from './modules/graphQl/graph-ql.module';
import { AuthModule } from './modules/auth/auth.module';
import { dbConfig, serverConfig } from './config';

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
    UserModule,
    GraphQlModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})

/**
 * Applies the CompanyContextMiddleware to all routes to ensure that the
 * company-specific database client is attached to each request.
 */
export class AppModule {}
