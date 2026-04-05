import { Global, Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../../../generated/platform-client/client.js';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { ConfigService } from '@nestjs/config';

@Global()
@Injectable()
export class PlatformPrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PlatformPrismaService.name);
  private readonly pool: Pool;

  constructor(private readonly config: ConfigService) {
    const connectionString = config.get<string>('db.platform.url');

    if (!connectionString) {
      const error = new Error('Missing required configuration: DATABASE_URL');
      Logger.error(error.message, error.stack, PlatformPrismaService.name);
      throw error;
    }

    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    super({ adapter });
    this.pool = pool;
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('::Platform Prisma connected successfully::');
    } catch (error) {
      const startupError = error instanceof Error ? error : new Error('Failed to initialize platform Prisma connection.');

      this.logger.error(`Platform Prisma initialization failed: ${startupError.message}`, startupError.stack);

      throw startupError;
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
      await this.pool.end();
    } catch (error) {
      const shutdownError = error instanceof Error ? error : new Error('Failed to shutdown platform Prisma connection.');

      this.logger.error(`Platform Prisma shutdown failed: ${shutdownError.message}`, shutdownError.stack);
      process.exit(1);
    }
  }
}
