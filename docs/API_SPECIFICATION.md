# TalentSync: GraphQL API Specification

**Version:** 1.0.0
**Last Updated:** 2026-03-29

---

## Overview

TalentSync uses a **hybrid API architecture**:
- **GraphQL** - Primary API for all client operations
- **REST** - Webhooks, health checks, OAuth callbacks, file uploads

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           CLIENT APPLICATIONS                            │
│                    (Web, Mobile, Third-party)                           │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                              API GATEWAY                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌────────────────────────────┐    ┌────────────────────────────────┐ │
│  │      GRAPHQL API           │    │        REST ENDPOINTS           │ │
│  │      (Primary)             │    │        (Secondary)              │ │
│  │                            │    │                                │ │
│  │  • Queries                 │    │  • /webhooks/stripe            │ │
│  │  • Mutations               │    │  • /webhooks/oauth/:provider   │ │
│  │  • Subscriptions           │    │  • /health                     │ │
│  │  • Field-level Auth        │    │  • /ready                      │ │
│  │  • Query Complexity        │    │  • /upload (alternative)      │ │
│  │                            │    │  • /graphql (playground)       │ │
│  └────────────────────────────┘    └────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           SERVICE LAYER                                  │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐    │
│  │   Auth   │ │  Tenant  │ │   Jobs   │ │Matching  │ │ Billing  │    │
│  │ Service  │ │ Service  │ │ Service  │ │ Service  │ │ Service  │    │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘    │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

| Component | Technology | Purpose |
|-----------|-------------|---------|
| **GraphQL Server** | Apollo Server 4 + NestJS | GraphQL API server |
| **Schema Definition** | GraphQL Schema Language | Type definitions |
| **Resolvers** | NestJS Service Layer | Business logic |
| **Subscriptions** | WebSocket (graphql-ws) | Real-time updates |
| **File Uploads** | graphql-upload | Multipart uploads |
| **Query Batching** | DataLoader | N+1 prevention |
| **Complexity Analysis** | graphql-query-complexity | Rate limiting |
| **Caching** | Redis + response-cache-plugin | Query caching |
| **Playground** | Apollo Sandbox | Development UI |

---

## Authentication

### JWT Authentication

All GraphQL operations require authentication except for:

```graphql
# Public operations (no auth required)
- login
- register
- verifyEmail
- forgotPassword
- resetPassword
- publicJobSearch
- publicJobDetail
```

### Authentication Header

```http
Authorization: Bearer <access_token>
```

### Token Refresh Flow

```graphql
mutation RefreshToken($refreshToken: String!) {
  refreshToken(refreshToken: $refreshToken) {
    accessToken
    refreshToken
    expiresIn
  }
}
```

---

## Schema Structure

### Core Types

```graphql
"""
User account - shared between candidates and recruiters
"""
type User {
  id: ID!
  email: String!
  emailVerified: Boolean!
  accountType: AccountType!
  status: UserStatus!
  profile: Profile
  createdAt: DateTime!
  updatedAt: DateTime!
}

enum AccountType {
  CANDIDATE
  RECRUITER
}

enum UserStatus {
  PENDING_VERIFICATION
  ACTIVE
  SUSPENDED
  DELETED
}

"""
Candidate profile - extends User
"""
type CandidateProfile {
  id: ID!
  user: User!
  headline: String
  summary: String
  experienceLevel: ExperienceLevel
  skills: [Skill!]!
  workPreferences: WorkPreferences
  visaStatus: [VisaRequirement!]!
  salaryExpectation: SalaryRange
  cvs: [CV!]!
  applications: ApplicationConnection!
  matches: MatchConnection!
  visibility: ProfileVisibility!
  createdAt: DateTime!
  updatedAt: DateTime!
}

"""
Recruiter profile - extends User
"""
type RecruiterProfile {
  id: ID!
  user: User!
  tenant: Tenant!
  role: TenantRole!
  jobTitle: String
  department: String
  jobs: JobConnection!
  createdAt: DateTime!
  updatedAt: DateTime!
}

"""
Tenant (Company) - multi-tenant isolation
"""
type Tenant {
  id: ID!
  name: String!
  slug: String!
  logo: String
  branding: TenantBranding
  subscription: Subscription
  settings: TenantSettings
  members: TenantMemberConnection!
  jobs: JobConnection!
  createdAt: DateTime!
  updatedAt: DateTime!
}

enum TenantRole {
  OWNER
  ADMIN
  RECRUITER
  VIEWER
}
```

---

## Queries

### Authentication Queries

```graphql
type Query {
  """
  Get current authenticated user
  """
  me: User! @auth

  """
  Get user's session list
  """
  sessions: [Session!]! @auth

  """
  Verify email token validity
  """
  verifyEmailToken(token: String!): VerifyEmailResult!
}
```

### Job Queries

```graphql
type Query {
  """
  Search jobs with filters and pagination
  """
  jobSearch(
    filter: JobSearchFilter!
    pagination: PaginationInput!
    sort: JobSortInput
  ): JobConnection! @auth @tenant(required: false)

  """
  Get job by ID
  """
  job(id: ID!): Job @auth @tenant(required: false)

  """
  Get job by slug (public access)
  """
  jobBySlug(slug: String!): Job @public

  """
  Get jobs posted by current recruiter
  """
  myJobs(
    pagination: PaginationInput!
    filter: MyJobsFilter
  ): JobConnection! @auth @role(recruiter: true)
}

input JobSearchFilter {
  query: String              # Full-text search
  location: LocationFilter
  remoteType: [RemoteType!]
  jobType: [JobType!]
  experienceLevel: [ExperienceLevel!]
  salaryMin: Int
  salaryMax: Int
  visaSponsorship: Boolean
  postedWithin: Int          # Days
  companyIds: [ID!]
  skills: [String!]
}

input LocationFilter {
  city: String
  country: String
  radius: Int                # km
  coordinates: CoordinatesInput
}

input CoordinatesInput {
  lat: Float!
  lng: Float!
}

type Job {
  id: ID!
  title: String!
  slug: String!
  description: String!
  requirements: String!
  location: Location!
  jobType: JobType!
  experienceLevel: ExperienceLevel!
  salary: Salary
  skills: [JobSkill!]!
  benefits: [String!]!
  visaSponsorship: Boolean!
  relocation: Boolean!
  questions: [JobQuestion!]
  status: JobStatus!
  company: CompanyInfo!       # Public company info
  applicationCount: Int @auth(requires: recruiter) @tier(pro: true)
  matchScore: Float          # For logged-in candidates
  matchedSkills: [String!]   # Skills matched with candidate profile
  createdAt: DateTime!
  updatedAt: DateTime!
  expiresAt: DateTime
}
```

### Candidate Queries

```graphql
type Query {
  """
  Search candidates (recruiters only)
  """
  candidateSearch(
    filter: CandidateSearchFilter!
    pagination: PaginationInput!
  ): CandidateConnection! @auth @role(recruiter: true)

  """
  Get candidate profile by ID (recruiters only)
  """
  candidate(id: ID!): CandidateProfile @auth @role(recruiter: true)

  """
  Get matched candidates for a job
  """
  jobCandidates(
    jobId: ID!
    pagination: PaginationInput!
    filter: MatchFilter
  ): CandidateMatchConnection! @auth @role(recruiter: true)

  """
  Get my candidate profile
  """
  myCandidateProfile: CandidateProfile! @auth @role(candidate: true)
}

input CandidateSearchFilter {
  skills: [String!]
  experienceLevel: [ExperienceLevel!]
  location: LocationFilter
  remotePreference: [RemoteType!]
  visaStatus: [String!]
  salaryMin: Int
  salaryMax: Int
  availability: AvailabilityFilter
}

input MatchFilter {
  minScore: Float
  maxScore: Float
  skillsMatch: [String!]
}
```

### Application Queries

```graphql
type Query {
  """
  Get my applications (candidates)
  """
  myApplications(
    pagination: PaginationInput!
    filter: ApplicationFilter
  ): ApplicationConnection! @auth @role(candidate: true)

  """
  Get applications for a job (recruiters)
  """
  jobApplications(
    jobId: ID!
    pagination: PaginationInput!
    filter: ApplicationFilter
  ): ApplicationConnection! @auth @role(recruiter: true)

  """
  Get single application details
  """
  application(id: ID!): Application! @auth
}

type Application {
  id: ID!
  job: Job!
  candidate: CandidateProfile!
  cv: CV!
  coverLetter: String
  customAnswers: [CustomAnswer!]
  status: ApplicationStatus!
  statusHistory: [StatusChange!]!
  matchScore: Float
  notes: [Note!] @auth(requires: recruiter)
  createdAt: DateTime!
  updatedAt: DateTime!
}
```

### Billing Queries

```graphql
type Query {
  """
  Get available subscription plans
  """
  subscriptionPlans: [SubscriptionPlan!]! @public

  """
  Get current tenant's subscription
  """
  mySubscription: Subscription! @auth @role(recruiter: true)

  """
  Get billing history
  """
  billingHistory(
    pagination: PaginationInput!
  ): BillingHistoryConnection! @auth @role(recruiter: true)

  """
  Get usage statistics
  """
  usageStats: UsageStats! @auth @role(recruiter: true)
}

type UsageStats {
  activeJobs: Int!
  jobLimit: Int!
  contactUnlocks: Int!
  unlockLimit: Int!
  cvParses: Int!
  cvParseLimit: Int!
  periodStart: DateTime!
  periodEnd: DateTime!
}
```

---

## Mutations

### Authentication Mutations

```graphql
type Mutation {
  """
  Register new user
  """
  register(input: RegisterInput!): AuthPayload!

  """
  Login with email and password
  """
  login(input: LoginInput!): AuthPayload!

  """
  Refresh access token
  """
  refreshToken(refreshToken: String!): AuthPayload!

  """
  Logout (invalidate session)
  """
  logout: Boolean! @auth

  """
  Logout all sessions
  """
  logoutAll: Boolean! @auth

  """
  Request password reset
  """
  forgotPassword(email: String!): Boolean!

  """
  Reset password with token
  """
  resetPassword(input: ResetPasswordInput!): Boolean!

  """
  Verify email address
  """
  verifyEmail(token: String!): Boolean!

  """
  Resend verification email
  """
  resendVerification(email: String!): Boolean!
}

input RegisterInput {
  email: String!
  password: String!
  firstName: String!
  lastName: String!
  accountType: AccountType!
  companyName: String         # Required if accountType is RECRUITER
}

input LoginInput {
  email: String!
  password: String!
  rememberMe: Boolean
  deviceInfo: DeviceInfoInput
}

input ResetPasswordInput {
  token: String!
  newPassword: String!
}

type AuthPayload {
  accessToken: String!
  refreshToken: String!
  expiresIn: Int!
  user: User!
}
```

### User Profile Mutations

```graphql
type Mutation {
  """
  Update user profile
  """
  updateProfile(input: UpdateProfileInput!): User! @auth

  """
  Update candidate profile
  """
  updateCandidateProfile(input: UpdateCandidateInput!): CandidateProfile! @auth @role(candidate: true)

  """
  Update recruiter profile
  """
  updateRecruiterProfile(input: UpdateRecruiterInput!): RecruiterProfile! @auth @role(recruiter: true)

  """
  Change password
  """
  changePassword(input: ChangePasswordInput!): Boolean! @auth

  """
  Delete account
  """
  deleteAccount: Boolean! @auth
}
```

### CV Mutations

```graphql
type Mutation {
  """
  Request presigned URL for CV upload
  """
  requestCVUpload(input: CVUploadInput!): CVUploadPayload! @auth @role(candidate: true)

  """
  Confirm CV upload completion
  """
  confirmCVUpload(cvId: ID!): CV! @auth @role(candidate: true)

  """
  Delete CV
  """
  deleteCV(id: ID!): Boolean! @auth @role(candidate: true)

  """
  Set primary CV
  """
  setPrimaryCV(id: ID!): CV! @auth @role(candidate: true)
}

input CVUploadInput {
  fileName: String!
  fileType: String!
  fileSize: Int!
}

type CVUploadPayload {
  cvId: ID!
  uploadUrl: String!
  fields: JSON!
  expiresAt: DateTime!
}
```

### Job Mutations

```graphql
type Mutation {
  """
  Create new job posting
  """
  createJob(input: CreateJobInput!): Job! @auth @role(recruiter: true)

  """
  Update job posting
  """
  updateJob(id: ID!, input: UpdateJobInput!): Job! @auth @role(recruiter: true)

  """
  Publish job
  """
  publishJob(id: ID!): Job! @auth @role(recruiter: true)

  """
  Pause job
  """
  pauseJob(id: ID!): Job! @auth @role(recruiter: true)

  """
  Close job
  """
  closeJob(id: ID!): Job! @auth @role(recruiter: true)

  """
  Archive job
  """
  archiveJob(id: ID!): Boolean! @auth @role(recruiter: true)

  """
  Clone job
  """
  cloneJob(id: ID!): Job! @auth @role(recruiter: true)
}

input CreateJobInput {
  title: String!
  description: String!
  requirements: String!
  location: LocationInput!
  jobType: JobType!
  experienceLevel: ExperienceLevel!
  salary: SalaryInput
  skills: [SkillInput!]!
  benefits: [String!]
  visaSponsorship: Boolean
  relocation: Boolean
  questions: [JobQuestionInput!]
}

input LocationInput {
  city: String
  country: String!
  remoteType: RemoteType!
  coordinates: CoordinatesInput
}

input SalaryInput {
  min: Int
  max: Int
  currency: String!
  isPublic: Boolean!
}
```

### Application Mutations

```graphql
type Mutation {
  """
  Submit job application
  """
  applyToJob(input: ApplyJobInput!): Application! @auth @role(candidate: true)

  """
  Withdraw application
  """
  withdrawApplication(id: ID!): Application! @auth @role(candidate: true)

  """
  Update application status (recruiter)
  """
  updateApplicationStatus(
    id: ID!
    status: ApplicationStatus!
    notes: String
  ): Application! @auth @role(recruiter: true)

  """
  Send message to candidate
  """
  sendMessageToCandidate(
    applicationId: ID!
    message: String!
  ): Message! @auth @role(recruiter: true)

  """
  Unlock candidate contact info
  """
  unlockCandidateContact(candidateId: ID!): CandidateContact! @auth @role(recruiter: true) @quota(type: contact_unlock)
}

input ApplyJobInput {
  jobId: ID!
  cvId: ID!
  coverLetter: String
  customAnswers: [CustomAnswerInput!]
}
```

### Tenant Mutations

```graphql
type Mutation {
  """
  Create tenant (company)
  """
  createTenant(input: CreateTenantInput!): Tenant! @auth

  """
  Update tenant settings
  """
  updateTenantSettings(
    tenantId: ID!
    settings: TenantSettingsInput!
  ): Tenant! @auth @role(tenantAdmin: true)

  """
  Invite team member
  """
  inviteTeamMember(input: InviteInput!): Invitation! @auth @role(tenantAdmin: true)

  """
  Accept invitation
  """
  acceptInvitation(token: String!): TenantMembership!

  """
  Remove team member
  """
  removeTeamMember(
    tenantId: ID!
    userId: ID!
  ): Boolean! @auth @role(tenantAdmin: true)

  """
  Update member role
  """
  updateMemberRole(
    tenantId: ID!
    userId: ID!
    role: TenantRole!
  ): TenantMembership! @auth @role(tenantAdmin: true)
}
```

### Billing Mutations

```graphql
type Mutation {
  """
  Create checkout session
  """
  createCheckoutSession(
    planId: ID!
    successUrl: String!
    cancelUrl: String!
  ): CheckoutSession! @auth @role(recruiter: true)

  """
  Cancel subscription
  """
  cancelSubscription(
    reason: String
  ): Subscription! @auth @role(recruiter: true)

  """
  Reactivate subscription
  """
  reactivateSubscription: Subscription! @auth @role(recruiter: true)

  """
  Change plan
  """
  changePlan(planId: ID!): Subscription! @auth @role(recruiter: true)
}

type CheckoutSession {
  sessionId: String!
  url: String!
}
```

---

## Subscriptions

### Real-Time Events

```graphql
type Subscription {
  """
  New application received (recruiters)
  """
  applicationReceived(jobId: ID): Application! @auth @role(recruiter: true)

  """
  Application status updated (candidates)
  """
  applicationStatusUpdated(applicationId: ID!): Application! @auth @role(candidate: true)

  """
  New message received
  """
  messageReceived(applicationId: ID!): Message! @auth

  """
  Match score updated
  """
  matchScoreUpdated: MatchUpdate! @auth

  """
  Job matches updated (for candidates)
  """
  jobMatchesUpdated: JobMatchUpdate! @auth @role(candidate: true)

  """
  Candidate matches updated (for recruiters)
  """
  candidateMatchesUpdated(jobId: ID!): CandidateMatchUpdate! @auth @role(recruiter: true)

  """
  Subscription status changed
  """
  subscriptionStatusChanged: Subscription! @auth @role(recruiter: true)

  """
  Quota warning
  """
  quotaWarning: QuotaWarning! @auth @role(recruiter: true)
}

type MatchUpdate {
  candidateId: ID!
  jobId: ID!
  matchScore: Float!
  matchReasons: [String!]!
}

type QuotaWarning {
  type: QuotaType!
  current: Int!
  limit: Int!
  percentage: Float!
}

enum QuotaType {
  ACTIVE_JOBS
  CONTACT_UNLOCKS
  CV_PARSES
}
```

---

## REST Endpoints

### Webhook Endpoints (Required REST)

```
POST /webhooks/stripe
  - Stripe webhook events
  - Signature verification required
  - Idempotency key handling

POST /webhooks/sendgrid
  - Email delivery events
  - Bounce handling

GET /webhooks/oauth/linkedin/callback
  - LinkedIn OAuth callback

GET /webhooks/oauth/google/callback
  - Google OAuth callback
```

### Health Endpoints

```
GET /health
  - Basic health check
  - Returns: { status: "ok", timestamp: ISO8601 }

GET /ready
  - Readiness check (dependencies)
  - Checks: Database, Redis, RabbitMQ
  - Returns: { status: "ready", checks: { db: true, redis: true, rabbitmq: true } }
```

### File Upload Endpoint (Alternative)

```
POST /upload/cv
  - Direct CV upload (alternative to presigned URL)
  - Multipart form data
  - Max size: 5MB
  - Returns: { cvId: ID, status: "pending" }
```

---

## Directives

### Authentication Directives

```graphql
"""
Require authentication
"""
directive @auth on FIELD_DEFINITION

"""
Require specific role
"""
directive @role(
  candidate: Boolean
  recruiter: Boolean
  tenantAdmin: Boolean
) on FIELD_DEFINITION

"""
Require public access (no auth)
"""
directive @public on FIELD_DEFINITION

"""
Require tenant context
"""
directive @tenant(required: Boolean) on FIELD_DEFINITION

"""
Require subscription tier
"""
directive @tier(
  basic: Boolean
  pro: Boolean
  enterprise: Boolean
) on FIELD_DEFINITION

"""
Require quota check
"""
directive @quota(type: QuotaType!) on FIELD_DEFINITION
```

### Field-Level Authorization

```graphql
type Job {
  id: ID!
  title: String!
  description: String!

  # Public field
  company: CompanyInfo! @public

  # Recruiter-only field
  applicationCount: Int @auth(requires: recruiter)

  # Pro-tier field
  matchedCandidates: [CandidateMatch!] @tier(pro: true)

  # Enterprise-only field
  analytics: JobAnalytics @tier(enterprise: true)
}

type CandidateProfile {
  id: ID!
  headline: String!
  skills: [Skill!]!

  # Visible to all recruiters
  experienceSummary: String!

  # Requires contact unlock
  email: String @contactUnlock
  phone: String @contactUnlock

  # Pro tier only
  salaryExpectation: SalaryRange @tier(pro: true)
}
```

---

## Query Complexity & Rate Limiting

### Complexity Calculation

```graphql
# Query complexity rules:
# - Base query: 1 point
# - Scalar fields: 0 points
# - Object fields: 1 point
# - Connection fields: 1 + (limit * objectComplexity)
# - Nested connections: Multiply complexity

# Example:
query {
  jobs(limit: 10) {           # 1 + (10 * 5) = 51
    id                         # 0
    title                      # 0
    applications(limit: 20) {  # 1 + (20 * 8) = 161
      id                       # 0
      candidate {              # 1
        id                     # 0
        profile {              # 1
          skills               # 0
        }
      }
    }
  }
}
# Total: 51 + 161 = 212 points
```

### Rate Limits

| User Type | Complexity Limit | Window |
|-----------|------------------|--------|
| Anonymous | 100 points | 1 minute |
| Free Tier | 500 points | 1 minute |
| Basic | 1,000 points | 1 minute |
| Pro | 2,000 points | 1 minute |
| Enterprise | 5,000 points | 1 minute |

---

## Error Handling

### Error Types

```graphql
type Error {
  message: String!
  code: ErrorCode!
  field: String
  details: JSON
}

enum ErrorCode {
  # Authentication
  UNAUTHENTICATED
  INVALID_CREDENTIALS
  TOKEN_EXPIRED
  TOKEN_INVALID
  EMAIL_NOT_VERIFIED

  # Authorization
  FORBIDDEN
  INSUFFICIENT_PERMISSIONS
  TIER_REQUIRED
  QUOTA_EXCEEDED

  # Validation
  VALIDATION_ERROR
  INVALID_INPUT
  DUPLICATE_ENTRY
  NOT_FOUND

  # Business Logic
  JOB_NOT_ACTIVE
  APPLICATION_EXISTS
  CV_PARSE_FAILED
  SUBSCRIPTION_REQUIRED

  # Rate Limiting
  RATE_LIMIT_EXCEEDED
  QUERY_TOO_COMPLEX

  # Server
  INTERNAL_ERROR
  SERVICE_UNAVAILABLE
}

type ValidationError implements Error {
  message: String!
  code: ErrorCode!
  field: String!
  details: JSON
}
```

### Error Response Format

```json
{
  "errors": [
    {
      "message": "Quota exceeded: You have reached your monthly contact unlock limit",
      "extensions": {
        "code": "QUOTA_EXCEEDED",
        "field": "unlockCandidateContact",
        "details": {
          "quotaType": "CONTACT_UNLOCKS",
          "current": 50,
          "limit": 50,
          "resetDate": "2026-04-01T00:00:00Z"
        }
      }
    }
  ],
  "data": null
}
```

---

## Pagination

### Connection Pattern

```graphql
type JobConnection {
  edges: [JobEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type JobEdge {
  node: Job!
  cursor: String!
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}

input PaginationInput {
  first: Int      # Limit
  after: String   # Cursor
  last: Int
  before: String
}
```

---

## Caching Strategy

### Query Caching

```graphql
# Cacheable queries (public data)
query GetJob($id: ID!) {
  job(id: $id) {
    id
    title
    description
  }
}
# Cache TTL: 5 minutes

# Non-cacheable queries (user-specific)
query GetMyApplications {
  myApplications {
    edges { node { id status } }
  }
}
# Cache: None
```

### Cache Invalidation

```typescript
// Automatic invalidation on mutations
@Mutation(() => Job)
async createJob() {
  // Invalidate cache keys:
  // - job:*
  // - jobs:list:*
  // - tenant:{tenantId}:jobs:*
}
```

---

## DataLoader Integration

### N+1 Query Prevention

```typescript
// User loader
const userLoader = new DataLoader(async (ids) => {
  const users = await userRepository.findByIds(ids);
  return ids.map(id => users.find(u => u.id === id));
});

// In resolver
@ResolveField(() => User)
async user(@Parent() application: Application) {
  return userLoader.load(application.userId);
}
```

---

## File: package.json Dependencies

```json
{
  "dependencies": {
    "@nestjs/graphql": "^12.0.0",
    "@nestjs/apollo": "^12.0.0",
    "@apollo/server": "^4.9.0",
    "graphql": "^16.8.0",
    "graphql-upload": "^16.0.0",
    "dataloader": "^2.2.0",
    "graphql-query-complexity": "^0.12.0",
    "@apollo/cache-control": "^1.0.0",
    "graphql-ws": "^5.14.0",
    "ws": "^8.14.0"
  }
}
```

---

**Document End**

*This API specification serves as the contract between frontend and backend teams. All GraphQL schema changes must be reviewed and approved before implementation.*