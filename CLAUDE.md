# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TalentSync is a job marketplace connecting candidates with opportunities based on skills and relocation goals. It uses a **multi-tenant architecture** where each company/workspace has its own dedicated PostgreSQL database.

## Monorepo Structure

```
apps/
  backend/    # NestJS + GraphQL API
  frontend/   # React + Vite frontend
packages/
  eslint-config/       # Shared ESLint presets
  typescript-config/   # Shared TypeScript configs
  ui/                  # Shared React components
```

## Common Commands

### Install & Setup
```sh
pnpm install                    # Install all dependencies
docker compose up -d postgres   # Start PostgreSQL (required for backend)
```

### Development
```sh
pnpm dev                # Run all apps in dev mode
pnpm dev:backend        # Run only NestJS backend
pnpm dev:frontend       # Run only Vite frontend
```

### Build & Quality
```sh
pnpm build              # Build all packages and apps
pnpm lint               # Run ESLint across workspace
pnpm check-types        # Run TypeScript type checks
pnpm format             # Format code with Prettier
```

### Testing
```sh
pnpm --filter backend test          # Backend unit tests
pnpm --filter backend test:e2e      # Backend E2E tests
```

### Environment-Specific Commands
The backend supports separate build/migrate commands per environment:
```sh
pnpm build:backend:development      # Build with NODE_ENV=development
pnpm build:backend:production      # Build with NODE_ENV=production
pnpm build:backend:test            # Build with NODE_ENV=test
```

## Multi-Tenant Database Architecture

**Critical: This project uses a two-database Prisma setup:**

1. **Global Database** (`prisma/global.prisma`) - Control-plane storing only `Tenant` records for routing
2. **Tenant Database** (`prisma/tenant.prisma`) - Application data schema (users, jobs, applications, etc.)

Each tenant gets its own PostgreSQL database. The `TenantService` caches PrismaClient instances per tenant slug.

### Tenant Resolution
- `TenantMiddleware` extracts tenant slug from hostname (e.g., `acme.talentsync.io` → `acme`)
- For local dev, use the full hostname as slug (e.g., `localhost1`)
- The slug is attached to `req.tenantSlug` for downstream use

### Generated Prisma Clients
- `generated/global-client/` - Client for the global/control-plane DB
- `generated/tenant-client/` - Client for tenant-specific DBs

Generate clients with:
```sh
pnpm --filter backend prisma:generate:development
```

## Environment Files

Backend uses environment-specific `.env` files:
- `.env.development` - Local development
- `.env.test` - Testing
- `.env.production` - Production

Key variables:
- `DATABASE_URL` - Connection string for global database
- `FRONTEND_ORIGIN` - CORS allowed origin (default: `http://localhost:5173`)
- `PORT` - Backend port (default: 3000)

## Ports & Endpoints

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`
- Backend health: `GET /api/health`
- PostgreSQL: `localhost:5432`

## Database Initialization

The `docker/init-dbs.sql` script creates both global and tenant databases. Start PostgreSQL first:
```sh
docker compose up -d postgres
```

## Tech Stack

- **Backend:** NestJS with GraphQL (Apollo Server)
- **Frontend:** React 19 + Vite
- **Database:** PostgreSQL with Prisma ORM (using driver adapters)
- **Monorepo:** pnpm workspaces + Turborepo

## Architecture Flow

```
Request → TenantMiddleware (extracts slug)
       → TenantService (gets cached tenant client)
       → Route Handler (uses tenant-specific PrismaClient)
```

All application data lives in tenant databases. The global database only stores tenant routing records.