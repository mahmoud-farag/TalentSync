import { Request } from 'express';

export interface CompanyRequest extends Request {
  companySlug: string;
}
