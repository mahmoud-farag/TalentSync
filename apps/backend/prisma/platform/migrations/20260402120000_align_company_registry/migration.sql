-- Drop the old slug field from the earlier control-plane design.
DROP INDEX IF EXISTS "companies_slug_key";

ALTER TABLE "companies"
DROP COLUMN IF EXISTS "slug";

-- Enforce the current routing keys used by the application.
CREATE UNIQUE INDEX "companies_host_name_key" ON "companies"("host_name");
CREATE UNIQUE INDEX "companies_db_name_key" ON "companies"("db_name");
