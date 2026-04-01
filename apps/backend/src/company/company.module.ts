import { Module } from '@nestjs/common';
import { CompanyClientRegistryService } from './application/company-client-registry.service';

@Module({
  providers: [CompanyClientRegistryService],
  exports: [CompanyClientRegistryService],
})
export class CompanyModule {}
