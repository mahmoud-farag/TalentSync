-- ============================================================
-- TalentSync: Initialize all local databases
-- This script runs once when the Docker volume is first created.
-- ============================================================

-- Platform DBs (routing metadata only)
CREATE DATABASE platform_development;
-- CREATE DATABASE platform_test;

-- Workspace DBs are managed manually from pgAdmin with hostname_<env> names
CREATE DATABASE localhost_development;
CREATE DATABASE localhost1_development;
CREATE DATABASE localhost2_development;


-- ============================================================
-- Seed Platform Database
-- ============================================================

\connect platform_development;

-- Create enum type for company status
DO $$ BEGIN
    CREATE TYPE "CompanyStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'ARCHIVED');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Create companies table (control-plane for tenant routing)
CREATE TABLE IF NOT EXISTS "companies" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" VARCHAR(100) NOT NULL,
    "host_name" VARCHAR(255) UNIQUE NOT NULL,
    "db_name" VARCHAR(255) UNIQUE NOT NULL,
    "status" "CompanyStatus" NOT NULL DEFAULT 'ACTIVE',
    "s3_bucket_name" VARCHAR(200),
    "s3_bucket_key" VARCHAR(200),
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT NOW()
);

-- Create index on host_name for fast routing lookups
CREATE INDEX IF NOT EXISTS "companies_host_name_idx" ON "companies"("host_name");

-- Seed tenant records
INSERT INTO "companies" ("id", "name", "host_name", "db_name", "status")
VALUES
    (gen_random_uuid(), 'localhost client', 'localhost', 'localhost_development', 'ACTIVE'),
    (gen_random_uuid(), 'localhost1 client', 'localhost1', 'localhost1_development', 'ACTIVE'),
    (gen_random_uuid(), 'localhost2 client', 'localhost2', 'localhost2_development', 'ACTIVE')
ON CONFLICT ("host_name") DO NOTHING;