# Repository Guidelines

## Project Structure & Module Organization

This repository is a `pnpm` + Turborepo workspace.

- `apps/backend`: NestJS API, Prisma schema, and backend tests.
  - Source: `apps/backend/src`
  - Unit tests: `apps/backend/src/*.spec.ts`
  - E2E tests: `apps/backend/test`
  - Prisma: `apps/backend/prisma`
- `apps/frontend`: React + TypeScript frontend built with Vite.
  - Source: `apps/frontend/src`
- `packages/eslint-config`: shared ESLint presets.
- `packages/typescript-config`: shared TS config presets.
- `packages/ui`: shared React UI components.

## Build, Test, and Development Commands

- `pnpm install`: install workspace dependencies.
- `pnpm dev`: run all app `dev` tasks through Turbo.
- `pnpm dev:backend`: run only the Nest backend.
- `pnpm dev:frontend`: run only the Vite frontend.
- `pnpm build`: build all packages and apps.
- `pnpm lint`: run ESLint across the workspace.
- `pnpm check-types`: run TypeScript checks across the workspace.
- `pnpm --filter backend test`: run backend unit tests.
- `pnpm --filter backend test:e2e`: run backend e2e tests.
- `docker compose up -d postgres`: start the local database. Redis/RabbitMQ entries are present but currently commented in `docker-compose.yml`.

## Coding Style & Naming Conventions

Use TypeScript throughout. Follow the existing 2-space indentation and single-quote style. Keep React components in `PascalCase`, functions and variables in `camelCase`, and file names aligned with the framework convention (`app.service.ts`, `App.tsx`, `vite.config.ts`).

Formatting and linting are enforced with Prettier and ESLint. Run `pnpm lint` and `pnpm format` before opening a PR.

## Testing Guidelines

Backend tests use Jest. Name unit tests `*.spec.ts` and keep them close to the source file when practical. Put integration/e2e coverage in `apps/backend/test`. Add or update tests when API behavior, Prisma models, or bootstrapping logic changes.

## Commit & Pull Request Guidelines

Recent commits use short, imperative summaries. Prefer clear subjects such as `add frontend health screen` or `configure backend cors`. Keep commits focused.

PRs should include:

- a short description of the change
- linked issue or task, if available
- testing notes (`pnpm build`, `pnpm lint`, backend tests)
- screenshots for frontend UI changes

## Security & Configuration Tips

Do not commit real `.env` files or credentials. Use the app-level `.env.example` files as templates. Treat `docker-compose.yml` and Prisma schema changes as infrastructure changes and document any required local setup updates in `README.md`.
