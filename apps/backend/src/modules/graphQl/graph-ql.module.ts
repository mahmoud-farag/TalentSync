import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'node:path';
import { CompanyModule } from '../company/company.module';
import { CompanyRegistryService } from '../company/company-client-registry.service';
import type { Request } from 'express';

@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [CompanyModule],
      inject: [CompanyRegistryService],
      useFactory: (companyRegistry: CompanyRegistryService) => ({
        autoSchemaFile: join(process.cwd(), 'src/gql/schema.gql'),
        graphiql: true,
        context: async ({ req }: { req: Request }) => ({
          req,
          db: await companyRegistry.getCompanyDb(req.hostname),
        }),
      }),
    }),
  ],
  providers: [],
  exports: [],
})
export class GraphQlModule {}
