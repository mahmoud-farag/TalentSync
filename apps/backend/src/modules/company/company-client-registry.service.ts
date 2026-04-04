import { Injectable, InternalServerErrorException, NotFoundException, OnModuleDestroy } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { PrismaClient } from '../../../generated/workspace-client/client.js';
import { PlatformPrismaService } from '../prisma/platform-prisma.service.js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CompanyRegistryService implements OnModuleDestroy {
  /**
   * Cache of per-company Prisma clients keyed by company slug.
   * This keeps the company bounded context connection lifecycle centralized.
   */
  private readonly companyClients = new Map<string, PrismaClient>();
  private readonly companyPools = new Map<string, Pool>();

  constructor(
    private readonly platformPrisma: PlatformPrismaService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Resolves a connected Prisma client for a company workspace.
   * The control-plane database is the source of truth for company routing.
   */
  async getCompanyDb(hostName: string): Promise<PrismaClient> {
    const cached = this.companyClients.get(hostName);
    if (cached) return cached;

    const company = await this.platformPrisma.company.findUnique({
      where: { hostName },
      select: { dbName: true, status: true },
    });

    if (!company) {
      throw new NotFoundException(`Company "${hostName}" not found.`);
    }

    if (company.status !== 'ACTIVE') {
      throw new NotFoundException(`Company "${hostName}" is not active.`);
    }

    if (!company?.dbName) {
      throw new NotFoundException(`Company "${hostName}" does not have a database.`);
    }

    const connectionString = this.buildDBUrl({ dbName: company.dbName });

    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    const client = new PrismaClient({ adapter });

    await client.$connect();

    this.companyClients.set(hostName, client);
    this.companyPools.set(hostName, pool);

    return client;
  }

  private buildDBUrl(args: { dbName: string }): string {
    const { dbName } = args;
    const companyDbConfig = this.configService.get('db.company');

    if (!companyDbConfig) {
      throw new InternalServerErrorException('Company database configuration not found.');
    }

    if (!companyDbConfig?.user || !companyDbConfig?.password || !companyDbConfig?.host || !companyDbConfig?.port) {
      throw new InternalServerErrorException(
        'Company database configuration is incomplete. make sure they exist on the env file',
      );
    }

    const { user, password, host, port } = companyDbConfig;

    const url = `postgresql://${user}:${password}@${host}:${port}/${dbName}`;

    return url;
  }

  async onModuleDestroy() {
    const disconnects = [...this.companyClients.values()].map((client) => client.$disconnect());
    await Promise.all(disconnects);

    const poolDisconnects = [...this.companyPools.values()].map((pool) => pool.end());
    await Promise.all(poolDisconnects);
  }
}
