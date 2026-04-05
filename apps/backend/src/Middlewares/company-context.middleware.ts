import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { CompanyRegistryService } from 'src/modules/company/company-client-registry.service';

/**
 * Middleware that resolves and attaches the company-specific database client
 * to each incoming request.
 *
 * This middleware is responsible for:
 * - Extracting the company identifier from the request hostname
 * - Resolving the appropriate tenant database via CompanyRegistryService
 * - Attaching the PrismaClient to the request object for downstream use
 *
 * The middleware utilizes dependency injection to share the CompanyRegistryService
 * instance, which caches database connections per company for efficiency.
 */
@Injectable()
export default class CompanyContextMiddleware implements NestMiddleware {
  private readonly logger = new Logger(CompanyContextMiddleware.name);

  constructor(private readonly companyRegistry: CompanyRegistryService) {}

  /**
   * Processes the incoming request to resolve and attach the company database client.
   *
   * @param req - The Express Request object, extended with the `db` property
   * @param res - The Express Response object
   * @param next - The NextFunction to continue the request pipeline
   *
   * @throws {NotFoundException} When the company cannot be resolved from hostname
   * @throws {NotFoundException} When the company is not in ACTIVE status
   * @throws {NotFoundException} When the company does not have a database configured
   */
  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    const hostname = req.hostname;
    const db = await this.companyRegistry.getCompanyDb(hostname);
    req.db = db;
    this.logger.debug(`Attached workspace client to request for host "${hostname}".`);
    next();
  }
}
