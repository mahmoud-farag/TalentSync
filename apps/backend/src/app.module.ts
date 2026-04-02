import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { dbConfig, serverConfig } from 'src/config';
import { CompanyModule } from './modules/company/company.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { CompanyContextMiddleware } from './Middlewares';
import { UserModule } from './modules/user/user.module';

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
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CompanyContextMiddleware).forRoutes('*');
  }
}
