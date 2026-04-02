-- ============================================================
-- TalentSync: Initialize all local databases
-- This script runs once when the Docker volume is first created.
-- ============================================================

-- Global / Control Plane DB (routing metadata only)
CREATE DATABASE talentsync_global_dev;
CREATE DATABASE talentsync_global_test;

-- Tenant databases (add more as you onboard local tenants)
CREATE DATABASE tenant_localhost1_dev;
CREATE DATABASE tenant_localhost2_dev;
CREATE DATABASE tenant_localhost1_test;
CREATE DATABASE tenant_localhost2_test;
