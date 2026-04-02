import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { NextFunction, Response, Request } from 'express';

export interface CompanyRequest extends Request {
  companySlug: string;
}

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

    console.log('---hostname:', hostname);

    if (!hostname) {
      throw new NotFoundException('Could not determine company from hostname.');
    }

    req.companySlug = hostname.split('.')[0];
    next();
  }
}
