# 🌍 TalentSync

**TalentSync** is a job marketplace that connects candidates with job opportunities based on their skills, preferences, and relocation goals.

It helps candidates discover the right jobs in target countries (e.g. Gulf, Europe) and enables recruiters to find qualified talent worldwide using a smart matching system.

---

## 🚀 Features

### 👤 Candidate

- Create profile with skills and experience
- Select preferred countries to work in
- Upload CV for automatic skill extraction
- Get personalized job recommendations
- Track job applications

### 🏢 Recruiter

- Create company profile
- Post job opportunities (with visa & remote options)
- Discover matching candidates
- Manage applications

---

## 🧠 Smart Matching

TalentSync uses a scoring system to match candidates with jobs based on:

- Skills
- Experience
- Preferred destinations
- Visa sponsorship
- Remote compatibility

Matches are computed asynchronously for better performance and scalability.

---

## ⚙️ Tech Stack

- **Backend:** NestJS + GraphQL
- **Frontend:** React
- **Database:** PostgreSQL (Prisma)
- **Queue:** RabbitMQ
- **Cache:** Redis
- **Search:** Elasticsearch

---

## 🏗️ Architecture Overview

```text
Client (React)
      ↓
GraphQL API (NestJS)
      ↓
-----------------------------------
Postgres  |  Redis  |  Elasticsearch
-----------------------------------
      ↓
RabbitMQ (Async Events)
      ↓
Workers (Matching, CV Processing, Notifications)
```

---

## 🔄 Core Flow

```text
Candidate uploads CV
→ Skills extracted
→ Matching engine runs
→ Jobs ranked and stored
→ Recommendations shown

Recruiter posts job
→ Matching candidates found
→ Notifications triggered
```

---

## 🎯 Goal

To simplify hiring by connecting the right talent with the right opportunities across borders.

---

## 📌 Status

🚧 In development — building core features and architecture.

---

## 🧱 Monorepo Setup

TalentSync currently uses a Turborepo workspace with separate applications for the frontend and backend:

- `apps/frontend`: React + TypeScript application powered by Vite
- `apps/backend`: NestJS API service
- `packages/eslint-config`: shared linting rules
- `packages/typescript-config`: shared TypeScript configuration

This matches the target deployment model:

- one server for the frontend application
- one server for the backend API
- Redis and RabbitMQ running alongside the backend server

---

## 🔌 Local Infrastructure

`docker-compose.yml` provisions the local backend-side dependencies:

- Redis on `localhost:6379`
- RabbitMQ on `localhost:5672`
- RabbitMQ management UI on `localhost:15672`

Start them with:

```sh
docker compose up -d redis rabbitmq
```

---

## ▶️ Local Development

Install dependencies:

```sh
pnpm install
```

Run both applications:

```sh
pnpm dev
```

Run one application only:

```sh
pnpm dev:frontend
pnpm dev:backend
```

---

## 🌐 Runtime Configuration

Backend example env file:

```sh
cp apps/backend/.env.example apps/backend/.env
```

Frontend example env file:

```sh
cp apps/frontend/.env.example apps/frontend/.env
```

Current startup defaults:

- frontend: `http://localhost:5173`
- backend: `http://localhost:3000`
- backend health endpoint: `GET /api/health`
- frontend API target: `VITE_API_BASE_URL=http://localhost:3000/api`
- backend allowed frontend origin: `FRONTEND_ORIGIN=http://localhost:5173`

---

## 📄 License

MIT
