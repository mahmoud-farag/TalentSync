import { PrismaClient } from 'generated/workspace-client/client';

/**
 * Express Request extended with company database client.
 * This interface augments the default Express Request to include
 * the tenant-specific PrismaClient for the current request.
 */
declare module 'express' {
  interface Request {
    db: PrismaClient;
  }
}
