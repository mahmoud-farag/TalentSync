import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { CompanyRequest } from '../../domain/company-request';

@Injectable()
export class CompanyContextMiddleware implements NestMiddleware {
  use(req: CompanyRequest, _res: Response, next: NextFunction) {
    /**
     * Extracts the company slug from the incoming request hostname.
     *
     * Examples:
     *   localhost1:3000   -> companySlug = "localhost1"
     *   acme.talentsync.io -> companySlug = "acme"
     */
    const hostname = req.hostname;

    if (!hostname) {
      throw new NotFoundException('Could not determine company from hostname.');
    }

    req.companySlug = hostname.split('.')[0];
    next();
  }
}
