import { Injectable, NotFoundException, OnModuleDestroy } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { PrismaClient } from '../../../generated/workspace-client/client.js';
import { GlobalPrismaService } from '../../prisma/global-prisma.service';

@Injectable()
export class CompanyClientRegistryService implements OnModuleDestroy {
  /**
   * Cache of per-company Prisma clients keyed by company slug.
   * This keeps the company bounded context connection lifecycle centralized.
   */
  private readonly companyClients = new Map<string, PrismaClient>();
  private readonly companyPools = new Map<string, Pool>();

  constructor(private readonly globalPrisma: GlobalPrismaService) {}

  /**
   * Resolves a connected Prisma client for a company workspace.
   * The control-plane database is the source of truth for company routing.
   */
  async getClient(companySlug: string): Promise<PrismaClient> {
    const cached = this.companyClients.get(companySlug);
    if (cached) return cached;

    const company = await this.globalPrisma.company.findUnique({
      where: { slug: companySlug },
      select: { databaseUrl: true, status: true },
    });

    if (!company) {
      throw new NotFoundException(`Company "${companySlug}" not found.`);
    }

    if (company.status !== 'ACTIVE') {
      throw new NotFoundException(`Company "${companySlug}" is not active.`);
    }

    const pool = new Pool({ connectionString: company.databaseUrl });
    const adapter = new PrismaPg(pool);
    const client = new PrismaClient({ adapter });

    await client.$connect();
    this.companyClients.set(companySlug, client);
    this.companyPools.set(companySlug, pool);

    return client;
  }

  async onModuleDestroy() {
    const disconnects = [...this.companyClients.values()].map((client) =>
      client.$disconnect(),
    );
    await Promise.all(disconnects);

    const poolDisconnects = [...this.companyPools.values()].map((pool) =>
      pool.end(),
    );
    await Promise.all(poolDisconnects);
  }
}
