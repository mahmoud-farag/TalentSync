import { Module } from '@nestjs/common';
import { CompanyRegistryService } from './company-client-registry.service';

@Module({
  providers: [CompanyRegistryService],
  exports: [CompanyRegistryService],
})
export class CompanyModule {}
