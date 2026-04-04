# Backend

## Multi-tenant layout

The backend uses a database-per-tenant model.

- `platform` database: shared control-plane metadata
- `workspace` database: one database per company

The platform database stores the routing record for each company:

- `name`
- `hostName`
- `dbName`
- `status`

At runtime, `CompanyContextMiddleware` reads `req.hostname`, resolves the company from the platform database, builds the workspace connection string, and attaches the company-specific Prisma client to `req.db`.

## Local development bootstrap

1. Install dependencies:

```bash
pnpm install
```

2. Start PostgreSQL:

```bash
docker compose up -d postgres
```

3. Generate Prisma clients:

```bash
pnpm --filter backend prisma:generate:development
```

4. Apply platform migrations:

```bash
pnpm --filter backend prisma:migrate:platform:development
```

5. Create or update tenant databases manually in pgAdmin using `hostname_<env>` names.

For local development, examples are:

- `localhost_development`
- `localhost1_development`
- `localhost2_development`

6. Sync the workspace schema into the target company database.

Update `COMPANY_DATABASE_URL` in `.env.development` to the tenant DB you want to sync, then run:

```bash
pnpm --filter backend prisma:sync:workspace:development
```

7. Add or update the matching row in `platform_development.companies` from pgAdmin.

8. Start the backend:

```bash
pnpm --filter backend start:development
```

## Company DB naming

Tenant database names should follow:

- `hostname_<env>`

For example, `localhost_development`.

## Useful commands

```bash
pnpm --filter backend prisma:migrate:platform:development
pnpm --filter backend prisma:sync:workspace:development
```
