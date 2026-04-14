const { execFileSync } = require('node:child_process');
const path = require('node:path');
const process = require('node:process');
const { Client } = require('pg');

const APP_ROOT = path.resolve(__dirname, '..');

function parseCliArgs(argv) {
  const args = {};

  for (let index = 0; index < argv.length; index += 1) {
    const item = argv[index];

    if (!item.startsWith('--')) {
      continue;
    }

    const key = item.slice(2);
    const next = argv[index + 1];

    if (!next || next.startsWith('--')) {
      args[key] = 'true';
      continue;
    }

    args[key] = next;
    index += 1;
  }

  return args;
}

function requireArg(args, key) {
  const value = args[key];

  if (!value) {
    throw new Error(`Missing required argument: --${key}`);
  }

  return value;
}

function buildConnectionString({ user, password, host, port, dbName, schema }) {
  const url = new URL('postgresql://placeholder');
  url.username = user;
  url.password = password;
  url.hostname = host;
  url.port = String(port);
  url.pathname = `/${dbName}`;
  url.searchParams.set('schema', schema);
  return url.toString();
}

function maskConnectionString(connectionString) {
  const url = new URL(connectionString);

  if (url.password) {
    url.password = '***';
  }

  if(url.username) {
    url.username = '***';
  }


  return url.toString();
}

async function getActiveTenantDbs(platformTarget) {
  const platformConnectionString = buildConnectionString({
    user: requireArg(platformTarget, 'user'),
    password: requireArg(platformTarget, 'password'),
    host: requireArg(platformTarget, 'host'),
    port: requireArg(platformTarget, 'port'),
    dbName: requireArg(platformTarget, 'db'),
    schema: platformTarget.schema,
  });

  const client = new Client({
    connectionString: platformConnectionString,
  });

  try {
    await client.connect();

    const result = await client.query(
      `
        SELECT "db_name"
        FROM "public"."companies"
        WHERE "status" = 'ACTIVE'
        ORDER BY "db_name" ASC
      `,
    );

    return result.rows.map((row) => row.db_name).filter(Boolean);
  } finally {
    await client.end();
  }
}

function pushWorkspaceSchema(target, dbName) {
    const connectionString = buildConnectionString({
      user: requireArg(target, 'user'),
      password: requireArg(target, 'password'),
      host: requireArg(target, 'host'),
      port: requireArg(target, 'port'),
      dbName,
      schema: target.schema,
    });

    console.log(`Pushing workspace schema to ${maskConnectionString(connectionString)}`);

    execFileSync(
      'pnpm',
      ['exec', 'prisma', 'db', 'push', '--config', './prisma/workspace/prisma.config.ts'],
      {
        cwd: APP_ROOT,
        env: {
          ...process.env,
          COMPANY_DATABASE_URL: connectionString,
        },
        stdio: 'inherit',
      },
    );
}

async function run() {
  const args = parseCliArgs(process.argv.slice(2));
  const runAll = args.all === 'true';

  if (runAll) {
    console.log('Running workspace schema push for all active tenant databases in platform.companies...');
  } else {
    console.log('Running workspace schema push for a single database...');
  }

  const workspaceTarget = {
    db: args.db,
    host: args.host,
    port: args.port,
    user: args.user,
    password: args.password,
    schema: args.schema || 'public',
  };

  const platformTarget = {
    db: args?.['platform-db'],
    host: args?.['platform-host'],
    port: args?.['platform-port'],
    user: args?.['platform-user'],
    password: args?.['platform-password'],
    schema: args?.['platform-schema'] || 'public',
  };

  // console.log('--platformTarget:', platformTarget);
  // console.log('--workspaceTarget:', workspaceTarget);

  const dbTargets = runAll
    ? await getActiveTenantDbs(platformTarget)
    : [requireArg(workspaceTarget, 'db')];

  if (!dbTargets.length) {
    throw new Error('No active tenant databases were found in platform.companies.');
  }

  dbTargets.forEach((dbName) => {
    pushWorkspaceSchema(workspaceTarget, dbName);
  });
}

try {
  run().catch((error) => {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Workspace schema push failed: ${message}`);
    process.exit(1);
  });
} catch (error) {
  const message = error instanceof Error ? error.message : 'Unknown error';
  console.error(`Workspace schema push failed: ${message}`);
  process.exit(1);
}
