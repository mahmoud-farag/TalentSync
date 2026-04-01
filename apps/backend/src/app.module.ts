import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { dbConfig, serverConfig } from 'config';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV || 'development'}`],
      load: [dbConfig, serverConfig],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
