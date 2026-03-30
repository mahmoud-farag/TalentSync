# TalentSync: Implementation Timeline

**Version:** 1.1.0
**Last Updated:** 2026-03-29
**Total Estimated Duration:** 16-20 weeks (MVP)
**API Architecture:** GraphQL (Primary) + REST (Webhooks/Health)

---

## Priority Legend

| Priority     | Code | Description                                 |
| ------------ | ---- | ------------------------------------------- |
| **Critical** | P0   | Must-have for MVP launch, blocks other work |
| **High**     | P1   | Essential for MVP, significant user impact  |
| **Medium**   | P2   | Important but can launch without            |
| **Low**      | P3   | Nice-to-have, post-MVP enhancement          |

---

## Technology Stack

### Backend

| Technology                | Purpose                    |
| ------------------------- | -------------------------- |
| NestJS                    | API Framework              |
| GraphQL (Apollo Server 4) | Primary API                |
| REST Controllers          | Webhooks, Health, OAuth    |
| Prisma                    | ORM & Database             |
| PostgreSQL                | Primary Database           |
| Redis                     | Caching, Sessions, Pub/Sub |
| RabbitMQ                  | Message Queue              |
| graphql-upload            | File uploads via GraphQL   |
| DataLoader                | N+1 query prevention       |
| graphql-query-complexity  | Rate limiting              |

### Frontend

| Technology    | Purpose                    |
| ------------- | -------------------------- |
| React 19      | UI Framework               |
| TypeScript    | Type Safety                |
| Vite          | Build Tool                 |
| Apollo Client | GraphQL Client             |
| urql (alt)    | Lightweight GraphQL Client |

---

## Phase 1: Foundation (Weeks 1-4)

### Sprint 1: Project Setup & Authentication (Week 1)

| Task                                    | Priority | Duration | Dependencies                | Assignee Suggestion |
| --------------------------------------- | -------- | -------- | --------------------------- | ------------------- |
| Initialize monorepo structure           | P0       | 4h       | -                           | Full-stack          |
| Configure TypeScript, ESLint, Prettier  | P0       | 2h       | Monorepo setup              | Full-stack          |
| Set up PostgreSQL database              | P0       | 2h       | -                           | Backend             |
| Set up Redis instance                   | P0       | 1h       | -                           | Backend             |
| Set up RabbitMQ instance                | P0       | 1h       | -                           | Backend             |
| Configure Docker Compose for local dev  | P0       | 2h       | PostgreSQL, Redis, RabbitMQ | Backend             |
| Create shared config package            | P0       | 3h       | Monorepo setup              | Full-stack          |
| **Setup NestJS with GraphQL**           | P0       | 3h       | -                           | Backend             |
| **Configure Apollo Server 4**           | P0       | 2h       | NestJS GraphQL              | Backend             |
| **Create GraphQL base schema**          | P0       | 2h       | Apollo Server               | Backend             |
| Design database schema (users, tenants) | P0       | 4h       | Database setup              | Backend             |
| **Define GraphQL types (User, Auth)**   | P0       | 2h       | Schema setup                | Backend             |
| **Implement register mutation**         | P0       | 3h       | GraphQL types               | Backend             |
| Implement password hashing service      | P0       | 2h       | -                           | Backend             |
| **Create email verification mutation**  | P0       | 2h       | Register mutation           | Backend             |
| **Implement login mutation**            | P0       | 3h       | Registration                | Backend             |
| **JWT token generation & validation**   | P0       | 3h       | Login                       | Backend             |
| **Create auth directives (@auth)**      | P0       | 2h       | GraphQL setup               | Backend             |
| **Setup GraphQL Playground**            | P0       | 1h       | Apollo Server               | Backend             |
| Create shared UI components package     | P1       | 4h       | Monorepo setup              | Frontend            |
| Initialize frontend app (React + Vite)  | P0       | 2h       | Monorepo setup              | Frontend            |
| **Setup Apollo Client**                 | P0       | 2h       | Frontend init               | Frontend            |
| Set up frontend routing                 | P1       | 2h       | Frontend init               | Frontend            |

**Sprint 1 Total:** ~50 hours (1 week, 1-2 developers)

---

### Sprint 2: User Management & Multi-Tenancy (Week 2)

| Task                                          | Priority | Duration | Dependencies          | Assignee Suggestion |
| --------------------------------------------- | -------- | -------- | --------------------- | ------------------- |
| Implement tenant database schema              | P0       | 3h       | Sprint 1 schema       | Backend             |
| Create tenant context service                 | P0       | 4h       | Tenant schema         | Backend             |
| Implement dynamic database connection pooling | P0       | 4h       | Tenant context        | Backend             |
| **Create @tenant directive**                  | P0       | 2h       | GraphQL setup         | Backend             |
| Automated database provisioning logic         | P1       | 3h       | Tenant isolation      | Backend             |
| **Define Tenant GraphQL types**               | P0       | 2h       | Tenant schema         | Backend             |
| Team invitation schema                        | P0       | 2h       | Tenant schema         | Backend             |
| **Create invitation mutations**               | P0       | 3h       | Invitation schema     | Backend             |
| Invitation acceptance flow                    | P0       | 3h       | Invitation creation   | Backend             |
| **Password reset mutation**                   | P0       | 3h       | Authentication module | Backend             |
| **Session management query/mutation**         | P1       | 2h       | JWT implementation    | Backend             |
| **Implement query complexity analysis**       | P0       | 3h       | GraphQL setup         | Backend             |
| **Setup rate limiting directive**             | P0       | 2h       | Complexity analysis   | Backend             |
| User profile schema                           | P0       | 2h       | User schema           | Backend             |
| **Profile CRUD resolvers**                    | P0       | 4h       | Profile schema        | Backend             |
| **Frontend: Login/Register pages (Apollo)**   | P0       | 6h       | Auth mutations        | Frontend            |
| Frontend: Email verification page             | P0       | 2h       | Verification flow     | Frontend            |
| Frontend: Password reset pages                | P0       | 2h       | Reset flow            | Frontend            |
| Frontend: Dashboard shell                     | P1       | 4h       | Frontend init         | Frontend            |

**Sprint 2 Total:** ~54 hours (1 week, 1-2 developers)

---

### Sprint 3: CV Management & File Storage (Week 3)

| Task                                       | Priority | Duration | Dependencies    | Assignee Suggestion |
| ------------------------------------------ | -------- | -------- | --------------- | ------------------- |
| Configure S3/MinIO bucket                  | P0       | 2h       | -               | Backend             |
| Implement presigned URL generation         | P0       | 2h       | S3 setup        | Backend             |
| CV database schema                         | P0       | 2h       | -               | Backend             |
| **Define CV GraphQL types**                | P0       | 2h       | CV schema       | Backend             |
| **CV upload mutation (presigned URL)**     | P0       | 3h       | CV types, S3    | Backend             |
| **CV upload via graphql-upload (alt)**     | P1       | 3h       | graphql-upload  | Backend             |
| **CV list/management queries**             | P0       | 2h       | CV types        | Backend             |
| **Frontend: CV upload component (Apollo)** | P0       | 4h       | Upload mutation | Frontend            |
| Frontend: CV management page               | P0       | 3h       | CV queries      | Frontend            |
| Create RabbitMQ queues                     | P0       | 2h       | RabbitMQ setup  | Backend             |
| CV parse worker skeleton                   | P0       | 3h       | RabbitMQ queues | Backend             |
| PDF parsing implementation                 | P0       | 4h       | Parse worker    | Backend             |
| DOCX parsing implementation                | P0       | 3h       | Parse worker    | Backend             |
| Parsed data storage                        | P0       | 2h       | Parsing         | Backend             |
| **Primary CV mutation**                    | P1       | 2h       | CV mutations    | Backend             |
| **CV deletion mutation**                   | P1       | 2h       | CV mutations    | Backend             |
| File type/size validation                  | P0       | 2h       | Upload endpoint | Backend             |

**Sprint 3 Total:** ~42 hours (1 week, 1-2 developers)

---

### Sprint 4: Jobs & Applications (Week 4)

| Task                                          | Priority | Duration | Dependencies         | Assignee Suggestion |
| --------------------------------------------- | -------- | -------- | -------------------- | ------------------- |
| Job database schema                           | P0       | 3h       | -                    | Backend             |
| **Define Job GraphQL types**                  | P0       | 3h       | Job schema           | Backend             |
| **Job CRUD mutations**                        | P0       | 4h       | Job types            | Backend             |
| **Job queries (search, detail)**              | P0       | 4h       | Job types            | Backend             |
| **Job connection with pagination**            | P0       | 2h       | Job queries          | Backend             |
| Job slug generation                           | P1       | 1h       | Job CRUD             | Backend             |
| **Job status mutation (publish/pause/close)** | P0       | 2h       | Job mutations        | Backend             |
| Application database schema                   | P0       | 2h       | Job schema           | Backend             |
| **Define Application GraphQL types**          | P0       | 2h       | Application schema   | Backend             |
| **Apply to job mutation**                     | P0       | 3h       | Application types    | Backend             |
| **Application queries (my applications)**     | P0       | 2h       | Application types    | Backend             |
| **Application status mutation (recruiter)**   | P0       | 2h       | Application types    | Backend             |
| Duplicate application check                   | P0       | 1h       | Application endpoint | Backend             |
| **Frontend: Job creation form (Apollo)**      | P0       | 6h       | Job mutations        | Frontend            |
| **Frontend: Job listing (pagination)**        | P0       | 4h       | Job queries          | Frontend            |
| **Frontend: Job detail page**                 | P0       | 4h       | Job queries          | Frontend            |
| **Frontend: Application form**                | P0       | 4h       | Apply mutation       | Frontend            |
| **Frontend: Application tracking page**       | P0       | 3h       | Application queries  | Frontend            |
| Quota enforcement (jobs per tier)             | P1       | 3h       | Billing schema       | Backend             |
| **Create @tier directive**                    | P0       | 2h       | GraphQL setup        | Backend             |
| **Create @quota directive**                   | P0       | 2h       | GraphQL setup        | Backend             |

**Sprint 4 Total:** ~55 hours (1 week, 1-2 developers)

---

## Phase 2: Core Features (Weeks 5-8)

### Sprint 5: Search & Discovery (Week 5)

| Task                                     | Priority | Duration | Dependencies     | Assignee Suggestion |
| ---------------------------------------- | -------- | -------- | ---------------- | ------------------- |
| **Design search GraphQL input types**    | P0       | 2h       | -                | Backend             |
| **Implement jobSearch query**            | P0       | 4h       | Search types     | Backend             |
| Create database indexes for search       | P0       | 2h       | Search queries   | Backend             |
| **Implement search filters in GraphQL**  | P0       | 3h       | Basic search     | Backend             |
| **Cursor-based pagination**              | P0       | 2h       | Search endpoints | Backend             |
| **DataLoader for N+1 prevention**        | P0       | 3h       | Queries          | Backend             |
| Search result caching                    | P1       | 2h       | Search endpoints | Backend             |
| Geo-radius search (PostGIS)              | P1       | 4h       | Location data    | Backend             |
| **Frontend: Job search page (Apollo)**   | P0       | 6h       | Search query     | Frontend            |
| **Frontend: Search filters UI**          | P0       | 4h       | Search page      | Frontend            |
| **Frontend: Infinite scroll pagination** | P0       | 3h       | Search page      | Frontend            |
| Saved searches schema                    | P1       | 2h       | -                | Backend             |
| **Job alerts mutation/query**            | P1       | 3h       | Saved searches   | Backend             |
| Job alerts scheduling                    | P1       | 4h       | Alerts schema    | Backend             |

**Sprint 5 Total:** ~42 hours (1 week, 1-2 developers)

---

### Sprint 6: Matching System (Week 6)

| Task                                         | Priority | Duration | Dependencies      | Assignee Suggestion |
| -------------------------------------------- | -------- | -------- | ----------------- | ------------------- |
| Matching algorithm design                    | P0       | 4h       | -                 | Backend             |
| Skill matching implementation                | P0       | 4h       | Matching design   | Backend             |
| Experience calculation                       | P0       | 3h       | Matching design   | Backend             |
| Location proximity scoring                   | P0       | 3h       | Matching design   | Backend             |
| Weighted scoring system                      | P0       | 3h       | Individual scores | Backend             |
| Match score storage schema                   | P0       | 2h       | -                 | Backend             |
| **Define Match GraphQL types**               | P0       | 2h       | Match schema      | Backend             |
| Matching worker implementation               | P0       | 4h       | RabbitMQ, scoring | Backend             |
| Matching triggers (CV upload)                | P0       | 2h       | Matching worker   | Backend             |
| Matching triggers (Job post)                 | P0       | 2h       | Matching worker   | Backend             |
| **jobCandidates query (matched candidates)** | P0       | 3h       | Match types       | Backend             |
| **matchedJobs query (for candidates)**       | P0       | 2h       | Match types       | Backend             |
| **Frontend: Matched candidates view**        | P0       | 4h       | Match queries     | Frontend            |
| **Frontend: Matched jobs view**              | P0       | 4h       | Match queries     | Frontend            |
| **Match explanation in GraphQL**             | P1       | 3h       | Matching          | Backend             |
| **Frontend: Match explanation UI**           | P1       | 2h       | Match explanation | Frontend            |

**Sprint 6 Total:** ~47 hours (1 week, 1-2 developers)

---

### Sprint 7: Billing & Subscriptions (Week 7)

| Task                                  | Priority | Duration | Dependencies       | Assignee Suggestion |
| ------------------------------------- | -------- | -------- | ------------------ | ------------------- |
| Stripe account setup                  | P0       | 2h       | -                  | Backend             |
| Subscription plans schema             | P0       | 2h       | -                  | Backend             |
| **Define Billing GraphQL types**      | P0       | 2h       | Billing schema     | Backend             |
| Stripe customer creation              | P0       | 2h       | Stripe setup       | Backend             |
| **createCheckoutSession mutation**    | P0       | 2h       | Stripe integration | Backend             |
| **REST: Stripe webhook endpoint**     | P0       | 3h       | Stripe integration | Backend             |
| Webhook signature verification        | P0       | 2h       | Webhook endpoint   | Backend             |
| Subscription event handling           | P0       | 4h       | Webhook endpoint   | Backend             |
| Subscription status sync              | P0       | 3h       | Events             | Backend             |
| **subscriptionPlans query**           | P0       | 1h       | Billing types      | Backend             |
| **mySubscription query**              | P0       | 1h       | Billing types      | Backend             |
| **changePlan mutation**               | P0       | 2h       | Billing types      | Backend             |
| **cancelSubscription mutation**       | P0       | 2h       | Billing types      | Backend             |
| Quota tracking schema                 | P0       | 2h       | -                  | Backend             |
| Quota enforcement middleware          | P0       | 3h       | Quota schema       | Backend             |
| **usageStats query**                  | P0       | 2h       | Quota schema       | Backend             |
| Customer portal integration           | P1       | 3h       | Stripe integration | Backend             |
| **Frontend: Pricing page (Apollo)**   | P0       | 4h       | Subscription plans | Frontend            |
| **Frontend: Checkout flow**           | P0       | 4h       | Checkout mutation  | Frontend            |
| **Frontend: Subscription management** | P0       | 4h       | Portal integration | Frontend            |
| **Frontend: Usage dashboard**         | P1       | 4h       | Usage query        | Frontend            |

**Sprint 7 Total:** ~50 hours (1 week, 1-2 developers)

---

### Sprint 8: Notifications & Communication (Week 8)

| Task                                        | Priority | Duration | Dependencies         | Assignee Suggestion |
| ------------------------------------------- | -------- | -------- | -------------------- | ------------------- |
| Notifications schema                        | P1       | 2h       | -                    | Backend             |
| **Define Notification GraphQL types**       | P1       | 2h       | Notification schema  | Backend             |
| **Notification queries**                    | P1       | 2h       | Notification types   | Backend             |
| **Notification mutations (mark read)**      | P1       | 1h       | Notification types   | Backend             |
| Notification creation service               | P1       | 3h       | Schema               | Backend             |
| SendGrid integration                        | P1       | 2h       | -                    | Backend             |
| Email templates design                      | P1       | 4h       | -                    | Frontend/Design     |
| Email template implementation               | P1       | 3h       | Templates            | Backend             |
| Email sending service                       | P1       | 2h       | SendGrid             | Backend             |
| **Setup GraphQL Subscriptions (WebSocket)** | P1       | 3h       | -                    | Backend             |
| **notificationReceived subscription**       | P1       | 2h       | Subscriptions        | Backend             |
| **applicationStatusUpdated subscription**   | P1       | 2h       | Subscriptions        | Backend             |
| **messageReceived subscription**            | P1       | 2h       | Subscriptions        | Backend             |
| **Frontend: Subscription setup (Apollo)**   | P1       | 2h       | WebSocket            | Frontend            |
| Frontend: Notification bell                 | P1       | 3h       | Notification query   | Frontend            |
| Frontend: Notification dropdown             | P1       | 3h       | Notification bell    | Frontend            |
| Frontend: Email preferences                 | P1       | 2h       | Preferences endpoint | Frontend            |
| In-app messaging schema                     | P2       | 2h       | -                    | Backend             |
| **Message mutations**                       | P2       | 2h       | Message schema       | Backend             |
| **Frontend: Messaging UI (real-time)**      | P2       | 6h       | Message mutations    | Frontend            |

**Sprint 8 Total:** ~48 hours (1 week, 1-2 developers)

---

## Phase 3: Polish & Security (Weeks 9-12)

### Sprint 9: Security Hardening (Week 9)

| Task                                          | Priority | Duration | Dependencies        | Assignee Suggestion |
| --------------------------------------------- | -------- | -------- | ------------------- | ------------------- |
| **GraphQL query complexity limits**           | P0       | 3h       | Complexity analysis | Backend             |
| **Rate limiting per query complexity**        | P0       | 2h       | Complexity limits   | Backend             |
| **Field-level authorization (@tier, @quota)** | P0       | 3h       | Directives          | Backend             |
| CAPTCHA integration                           | P1       | 2h       | -                   | Backend             |
| Security headers (Helmet)                     | P0       | 1h       | -                   | Backend             |
| CORS configuration                            | P0       | 1h       | -                   | Backend             |
| **GraphQL input validation**                  | P0       | 3h       | -                   | Backend             |
| SQL injection prevention review               | P0       | 2h       | -                   | Backend             |
| XSS prevention audit                          | P0       | 2h       | -                   | Backend             |
| Password breach check (HaveIBeenPwned)        | P1       | 2h       | -                   | Backend             |
| Audit logging implementation                  | P0       | 4h       | -                   | Backend             |
| Audit log storage                             | P0       | 2h       | Audit logging       | Backend             |
| **GraphQL error handling & formatting**       | P0       | 3h       | -                   | Backend             |
| **REST health check endpoints**               | P0       | 2h       | -                   | Backend             |
| Frontend: Security settings page              | P1       | 4h       | -                   | Frontend            |
| Frontend: CAPTCHA components                  | P1       | 2h       | CAPTCHA integration | Frontend            |

**Sprint 9 Total:** ~36 hours (1 week, 1 developer)

---

### Sprint 10: Performance Optimization (Week 10)

| Task                               | Priority | Duration | Dependencies | Assignee Suggestion |
| ---------------------------------- | -------- | -------- | ------------ | ------------------- |
| Database query optimization        | P0       | 4h       | -            | Backend             |
| Index analysis & creation          | P0       | 3h       | -            | Backend             |
| Connection pooling setup           | P1       | 2h       | -            | Backend             |
| Redis caching strategy             | P0       | 3h       | -            | Backend             |
| **GraphQL query caching**          | P0       | 3h       | Redis        | Backend             |
| **Response cache plugin (Apollo)** | P1       | 2h       | GraphQL      | Backend             |
| **DataLoader optimization**        | P0       | 4h       | -            | Backend             |
| **Batched queries optimization**   | P1       | 2h       | DataLoader   | Backend             |
| Frontend: Code splitting           | P1       | 3h       | -            | Frontend            |
| Frontend: Lazy loading             | P1       | 2h       | -            | Frontend            |
| Frontend: Image optimization       | P1       | 2h       | -            | Frontend            |
| CDN configuration                  | P1       | 2h       | -            | DevOps              |
| Gzip/Brotli compression            | P1       | 1h       | -            | Backend             |
| Load testing script creation       | P1       | 3h       | -            | QA/Backend          |
| Performance baseline measurement   | P1       | 2h       | Load testing | QA/Backend          |

**Sprint 10 Total:** ~38 hours (1 week, 1 developer)

---

### Sprint 11: Testing & Quality (Week 11)

| Task                                             | Priority | Duration | Dependencies                | Assignee Suggestion |
| ------------------------------------------------ | -------- | -------- | --------------------------- | ------------------- |
| **Unit tests: GraphQL resolvers (Auth)**         | P0       | 4h       | Auth implementation         | Backend/QA          |
| **Unit tests: GraphQL resolvers (Tenant)**       | P0       | 3h       | Tenant implementation       | Backend/QA          |
| **Unit tests: GraphQL resolvers (Jobs)**         | P0       | 4h       | Jobs implementation         | Backend/QA          |
| **Unit tests: GraphQL resolvers (Applications)** | P0       | 4h       | Applications implementation | Backend/QA          |
| **Unit tests: GraphQL resolvers (Matching)**     | P0       | 4h       | Matching implementation     | Backend/QA          |
| **Integration tests: GraphQL operations**        | P0       | 4h       | All modules                 | Backend/QA          |
| **E2E tests: GraphQL flows**                     | P0       | 4h       | All modules                 | QA                  |
| Integration tests: Billing webhooks              | P0       | 3h       | Billing module              | Backend/QA          |
| **E2E tests: Critical paths (Apollo Client)**    | P1       | 6h       | All modules                 | QA                  |
| E2E tests: Payment flow                          | P1       | 4h       | Billing                     | QA                  |
| **Frontend: Component tests**                    | P1       | 4h       | Frontend                    | Frontend/QA         |
| **GraphQL schema validation tests**              | P1       | 2h       | Schema                      | Backend/QA          |
| Test coverage report                             | P1       | 2h       | All tests                   | QA                  |

**Sprint 11 Total:** ~48 hours (1 week, 2 developers)

---

### Sprint 12: Documentation & Final Polish (Week 12)

| Task                                   | Priority | Duration | Dependencies | Assignee Suggestion |
| -------------------------------------- | -------- | -------- | ------------ | ------------------- |
| **GraphQL schema documentation**       | P0       | 4h       | All types    | Backend             |
| **Apollo Sandbox setup**               | P1       | 2h       | GraphQL      | Backend             |
| Database schema documentation          | P1       | 2h       | All schemas  | Backend             |
| Deployment documentation               | P0       | 3h       | -            | DevOps              |
| README updates                         | P1       | 2h       | -            | Full-stack          |
| Environment setup guide                | P0       | 2h       | -            | DevOps              |
| User guide draft                       | P2       | 4h       | -            | Product             |
| **Error code documentation (GraphQL)** | P1       | 2h       | -            | Backend             |
| Frontend: Error handling polish        | P0       | 3h       | -            | Frontend            |
| **Frontend: GraphQL error boundaries** | P1       | 2h       | -            | Frontend            |
| Frontend: Loading states               | P1       | 2h       | -            | Frontend            |
| Frontend: Empty states                 | P1       | 2h       | -            | Frontend            |
| Frontend: Accessibility audit          | P1       | 4h       | -            | Frontend            |
| UI polish & consistency                | P1       | 4h       | -            | Frontend            |
| Mobile responsiveness                  | P1       | 4h       | -            | Frontend            |

**Sprint 12 Total:** ~42 hours (1 week, 1-2 developers)

---

## Phase 4: Launch Preparation (Weeks 13-16)

### Sprint 13: Infrastructure & DevOps (Week 13)

| Task                                        | Priority | Duration | Dependencies  | Assignee Suggestion |
| ------------------------------------------- | -------- | -------- | ------------- | ------------------- |
| Production environment setup                | P0       | 4h       | -             | DevOps              |
| CI/CD pipeline configuration                | P0       | 4h       | -             | DevOps              |
| Database backup automation                  | P0       | 2h       | Production DB | DevOps              |
| SSL certificate setup                       | P0       | 1h       | -             | DevOps              |
| Domain configuration                        | P0       | 1h       | -             | DevOps              |
| Environment variables setup                 | P0       | 2h       | -             | DevOps              |
| Secrets management (Vault/AWS SM)           | P0       | 3h       | -             | DevOps              |
| **GraphQL Playground configuration (prod)** | P0       | 1h       | -             | Backend             |
| **WebSocket server configuration**          | P0       | 2h       | -             | Backend             |
| Log aggregation setup                       | P1       | 3h       | -             | DevOps              |
| Monitoring dashboard                        | P1       | 4h       | -             | DevOps              |
| Alert configuration                         | P1       | 2h       | Monitoring    | DevOps              |
| **REST: Health check endpoints**            | P0       | 2h       | -             | Backend             |
| Graceful shutdown handling                  | P0       | 2h       | -             | Backend             |
| Container orchestration config              | P0       | 4h       | -             | DevOps              |

**Sprint 13 Total:** ~37 hours (1 week, 1 DevOps)

---

### Sprint 14: Security & Compliance (Week 14)

| Task                                     | Priority | Duration | Dependencies        | Assignee Suggestion |
| ---------------------------------------- | -------- | -------- | ------------------- | ------------------- |
| **Security penetration testing**         | P0       | 8h       | All features        | Security            |
| **GraphQL introspection disable (prod)** | P0       | 1h       | -                   | Backend             |
| Vulnerability scanning                   | P0       | 2h       | -                   | Security            |
| Dependency audit                         | P0       | 2h       | -                   | Security            |
| GDPR compliance checklist                | P0       | 4h       | -                   | Legal/Product       |
| Privacy policy page                      | P1       | 2h       | -                   | Frontend            |
| Terms of service page                    | P1       | 2h       | -                   | Frontend            |
| Cookie consent implementation            | P0       | 2h       | -                   | Frontend            |
| **GDPR: dataExport mutation**            | P0       | 3h       | -                   | Backend             |
| **GDPR: deleteAccount mutation**         | P0       | 3h       | -                   | Backend             |
| Consent tracking                         | P0       | 2h       | -                   | Backend             |
| Security fixes from audit                | P0       | 8h       | Penetration testing | Backend             |

**Sprint 14 Total:** ~39 hours (1 week, 2 developers)

---

### Sprint 15: Load Testing & Optimization (Week 15)

| Task                                   | Priority | Duration | Dependencies | Assignee Suggestion |
| -------------------------------------- | -------- | -------- | ------------ | ------------------- |
| **Load test: GraphQL queries**         | P1       | 4h       | -            | QA                  |
| **Load test: GraphQL mutations**       | P1       | 4h       | -            | QA                  |
| Load test: Concurrent users            | P1       | 4h       | -            | QA                  |
| **Load test: WebSocket subscriptions** | P1       | 3h       | -            | QA                  |
| Stress test: API endpoints             | P1       | 4h       | -            | QA                  |
| Performance bottleneck identification  | P1       | 4h       | Load tests   | Backend             |
| Database query optimization            | P1       | 4h       | Bottlenecks  | Backend             |
| Caching improvements                   | P1       | 3h       | Bottlenecks  | Backend             |
| Worker scaling tests                   | P1       | 3h       | -            | Backend             |
| Memory leak detection                  | P1       | 4h       | -            | Backend             |
| Auto-scaling configuration             | P2       | 3h       | Load tests   | DevOps              |

**Sprint 15 Total:** ~40 hours (1 week, 2 developers)

---

### Sprint 16: Final Launch (Week 16)

| Task                                    | Priority | Duration | Dependencies      | Assignee Suggestion |
| --------------------------------------- | -------- | -------- | ----------------- | ------------------- |
| Production deployment checklist         | P0       | 2h       | -                 | DevOps              |
| Database migration to production        | P0       | 3h       | -                 | Backend             |
| Final smoke testing                     | P0       | 4h       | Production deploy | QA                  |
| Rollback procedure documentation        | P0       | 2h       | -                 | DevOps              |
| Monitoring verification                 | P0       | 2h       | -                 | DevOps              |
| Launch announcement preparation         | P2       | 2h       | -                 | Product             |
| Support documentation                   | P1       | 4h       | -                 | Product             |
| **GraphQL error handling final review** | P0       | 3h       | -                 | Backend             |
| Production secrets rotation             | P0       | 2h       | -                 | DevOps              |
| DNS cutover                             | P0       | 1h       | -                 | DevOps              |
| Post-launch monitoring                  | P0       | 4h       | Launch            | DevOps              |
| Hotfix procedures                       | P0       | 2h       | -                 | DevOps              |

**Sprint 16 Total:** ~31 hours (1 week, 1-2 developers)

---

## Post-MVP Roadmap (P2/P3 Features)

### Phase 5: Enhanced Features (Weeks 17-20)

| Feature                                 | Priority | Duration | Dependencies  |
| --------------------------------------- | -------- | -------- | ------------- |
| **OAuth: REST callback endpoints**      | P2       | 4h       | Auth module   |
| **OAuth: LinkedIn integration**         | P2       | 12h      | REST callback |
| **OAuth: Google integration**           | P2       | 6h       | REST callback |
| Two-factor authentication               | P2       | 12h      | Auth module   |
| **GraphQL: Advanced analytics queries** | P2       | 20h      | Analytics     |
| Interview scheduling                    | P2       | 20h      | Calendar API  |
| Offer letter generation                 | P2       | 16h      | Templates     |
| Bulk job import/export                  | P2       | 12h      | Jobs module   |
| Company branding page                   | P2       | 16h      | Frontend      |
| Recruiter performance tracking          | P2       | 12h      | Analytics     |
| Elasticsearch integration               | P2       | 40h      | Search module |

### Phase 6: Enterprise Features (Weeks 21-24)

| Feature                                     | Priority | Duration | Dependencies  |
| ------------------------------------------- | -------- | -------- | ------------- |
| SSO/SAML integration                        | P3       | 24h      | Auth module   |
| Custom domain support                       | P3       | 12h      | Frontend, DNS |
| **REST: Webhook outputs (ATS integration)** | P3       | 24h      | API module    |
| **GraphQL: Public API (rate limited)**      | P3       | 32h      | API module    |
| Advanced reporting                          | P3       | 24h      | Analytics     |
| White-label options                         | P3       | 20h      | Frontend      |
| Dedicated account manager features          | P3       | 16h      | Admin         |
| SLA monitoring dashboard                    | P3       | 16h      | Monitoring    |

### Phase 7: AI Enhancement (Weeks 25+)

| Feature                                  | Priority | Duration | Dependencies   |
| ---------------------------------------- | -------- | -------- | -------------- |
| **GraphQL: AI job description mutation** | P3       | 16h      | AI integration |
| AI CV parsing enhancement                | P3       | 24h      | CV module      |
| **Smart candidate ranking (GraphQL)**    | P3       | 12h      | Matching       |
| Salary prediction                        | P3       | 20h      | AI, Analytics  |
| Skill gap analysis                       | P3       | 16h      | AI, Matching   |
| Interview question suggestions           | P3       | 16h      | AI             |

---

## GraphQL-Specific Implementation Notes

### DataLoader Setup

```typescript
// src/common/dataloaders/user.loader.ts
@Injectable()
export class UserLoader {
  @Loader()
  userLoader = new DataLoader<string, User>(async (ids) => {
    const users = await this.userService.findByIds(ids);
    return ids.map((id) => users.find((u) => u.id === id));
  });
}
```

### Directive Implementation

```typescript
// src/common/directives/auth.directive.ts
@Directive('@auth')
export class AuthDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field: GraphQLField<any, any>) {
    const { resolve = defaultFieldResolver } = field;
    field.resolve = async function (...args) {
      const context = args[2];
      if (!context.user) {
        throw new AuthenticationError('Not authenticated');
      }
      return resolve.apply(this, args);
    };
  }
}
```

### Query Complexity

```typescript
// src/main.ts
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  validationRules: [
    createComplexityLimitRule(1000, {
      onCost: (cost) => console.log('Query cost:', cost),
    }),
  ],
});
```

---

## Summary Estimates

| Phase                      | Duration     | Total Hours    | Team Size          |
| -------------------------- | ------------ | -------------- | ------------------ |
| Phase 1: Foundation        | 4 weeks      | ~201 hours     | 1-2 developers     |
| Phase 2: Core Features     | 4 weeks      | ~187 hours     | 1-2 developers     |
| Phase 3: Polish & Security | 4 weeks      | ~164 hours     | 1-2 developers     |
| Phase 4: Launch Prep       | 4 weeks      | ~147 hours     | 1-2 developers     |
| **MVP Total**              | **16 weeks** | **~699 hours** | **1-2 developers** |

### GraphQL vs REST Task Distribution

| Category             | GraphQL | REST | Notes                            |
| -------------------- | ------- | ---- | -------------------------------- |
| API Development      | 85%     | 15%  | Webhooks, health checks use REST |
| Frontend Integration | 90%     | 10%  | Most data via Apollo Client      |
| File Uploads         | 50%     | 50%  | graphql-upload OR presigned URL  |
| Real-time            | 100%    | 0%   | WebSocket subscriptions          |

---

## Critical Path

```
Auth (GraphQL) → Tenant (GraphQL) → CV (GraphQL) → Jobs (GraphQL) → Applications → Billing → Launch
         ↓
   Subscriptions (WebSocket) → Search (DataLoader) → Matching → Testing → Deploy
```

**Critical GraphQL-specific dependencies:**

1. GraphQL schema setup blocks all resolvers
2. Auth directives (@auth, @role) block protected queries
3. DataLoader setup blocks performant queries
4. Subscriptions setup blocks real-time features
5. Query complexity limits block production deployment

---

## Risk Mitigation (GraphQL-Specific)

| Risk                        | Probability | Impact | Mitigation                      |
| --------------------------- | ----------- | ------ | ------------------------------- |
| N+1 query performance       | High        | High   | Implement DataLoader early      |
| Query complexity attacks    | Medium      | High   | Configure complexity limits     |
| Subscription memory leaks   | Medium      | Medium | Implement connection cleanup    |
| Schema migration complexity | Medium      | Medium | Use schema stitching/federation |
| Learning curve for team     | Medium      | Low    | Allocate extra time in Sprint 1 |

---

## Milestone Checkpoints

| Week | Milestone                | Success Criteria                                 |
| ---- | ------------------------ | ------------------------------------------------ |
| 2    | GraphQL Auth Complete    | Users can register, login via GraphQL            |
| 4    | Core GraphQL CRUD        | Jobs created, applications submitted via GraphQL |
| 6    | Matching + Subscriptions | Real-time updates working                        |
| 8    | Billing (REST Webhooks)  | Subscriptions processed                          |
| 10   | Security Hardened        | Query complexity limits enforced                 |
| 12   | Testing Complete         | 80% resolver coverage                            |
| 14   | Production Ready         | All security issues resolved                     |
| 16   | **Launch**               | GraphQL API public                               |

---

**Document End**

_This timeline is an estimate and should be adjusted based on team velocity, complexity discoveries, and changing requirements. GraphQL-specific tasks are highlighted in the task lists._
