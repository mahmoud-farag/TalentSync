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

6. Push the workspace schema into the new tenant database with the dedicated backend script:

```bash
pnpm --filter backend tenant:schema:push -- \
  --db localhost1_development \
  --host localhost \
  --port 5432 \
  --user postgres \
  --password postgres
```

The command requires explicit DB connection args and does not store credentials in the script.

To push the schema to all configured local tenant databases at once, run:

```bash
pnpm --filter backend tenant:schema:push:all -- \
  --host localhost \
  --port 5432 \
  --user postgres \
  --password postgres \
  --platform-db platform_development \
  --platform-host localhost \
  --platform-port 5432 \
  --platform-user postgres \
  --platform-password postgres
```

The bulk command reads active tenant database names from `platform_development.public.companies` and applies the schema to every tenant row where `status = ACTIVE`.

7. Add or update the matching row in `platform_development.public.companies` from pgAdmin.

Example:

- `name`: `Localhost 1`
- `host_name`: `localhost1`
- `db_name`: `localhost1_development`
- `status`: `ACTIVE`

8. Start the backend:

```bash
pnpm --filter backend start:development
```

## Company DB naming

Tenant database names should follow:

- `hostname_<env>`

For example, `localhost_development`.

## Manual Tenant Onboarding

Use this flow whenever you add a new tenant manually from pgAdmin.

1. Create a new PostgreSQL database using the pattern `hostname_<env>`.

Example:

- `localhost1_development`

2. Open the new database in pgAdmin and launch the Query Tool.

3. Run the schema push command:

```bash
pnpm --filter backend tenant:schema:push -- \
  --db localhost1_development \
  --host localhost \
  --port 5432 \
  --user postgres \
  --password postgres
```

4. Verify the new tenant database now has the workspace tables under `public`.

5. Open `platform_development` in pgAdmin and insert a company row into `public.companies`.

Example SQL:

```sql
INSERT INTO public.companies (
  id,
  name,
  host_name,
  db_name,
  status,
  created_at,
  updated_at
)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'Localhost 1',
  'localhost1',
  'localhost1_development',
  'ACTIVE',
  NOW(),
  NOW()
);
```

6. Start or restart the backend.

7. Send requests using the tenant hostname so the app resolves the correct workspace database.

## Useful commands

```bash
pnpm --filter backend prisma:migrate:platform:development
pnpm --filter backend tenant:schema:push -- --db localhost1_development --host localhost --port 5432 --user postgres --password postgres
pnpm --filter backend tenant:schema:push:all -- --host localhost --port 5432 --user postgres --password postgres --platform-db platform_development --platform-host localhost --platform-port 5432 --platform-user postgres --platform-password postgres
```
