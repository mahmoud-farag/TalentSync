# TalentSync: Complete System Requirements Document

**Version:** 1.0.0
**Last Updated:** 2026-03-29
**Status:** Draft

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [System Architecture Overview](#2-system-architecture-overview)
3. [Functional Requirements](#3-functional-requirements)
4. [Non-Functional Requirements](#4-non-functional-requirements)
5. [Security Requirements](#5-security-requirements)
6. [Compliance & Data Governance](#6-compliance--data-governance)
7. [Implementation Roadmap](#7-implementation-roadmap)
8. [Glossary](#8-glossary)

---

## 1. Executive Summary

### 1.1 Product Vision

TalentSync is a B2B2C SaaS Event-Driven International Job Marketplace that connects Candidates with Recruiters through AI-powered matching. The platform operates on a multi-tenant architecture, serving both individual job seekers (B2C) and organizational recruiters (B2B) through subscription tiers and usage-based billing.

### 1.2 Core Value Propositions

| Stakeholder    | Value Proposition                                                                                           |
| -------------- | ----------------------------------------------------------------------------------------------------------- |
| **Candidates** | AI-scored job recommendations, global opportunity access, application tracking, profile visibility controls |
| **Recruiters** | Pre-scored candidate matching, team collaboration, subscription-based hiring, analytics dashboard           |
| **Platform**   | Recurring SaaS revenue, usage-based upselling, scalable multi-tenant architecture                           |

### 1.3 Key Differentiators

- Event-driven architecture for real-time responsiveness
- AI-powered matching with explainability
- Multi-tenant data isolation with enterprise-grade security
- International focus (visa, relocation, remote work support)
- Usage-based billing with transparent quota management

---

## 2. System Architecture Overview

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐              │
│  │  Candidate Web  │  │  Recruiter Web  │  │   Admin Panel  │              │
│  │   (React/Vite)  │  │   (React/Vite)  │  │   (React/Vite)  │              │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘              │
│           │                    │                    │                        │
│           └────────────────────┼────────────────────┘                        │
│                                │                                             │
│                                ▼                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                              API GATEWAY                                     │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │  Rate Limiting │ Authentication │ Request Routing │ Load Balancing    ││
│  └─────────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           APPLICATION LAYER                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │                        NESTJS API SERVERS                                ││
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐    ││
│  │  │   Auth       │ │   Tenant     │ │   Jobs       │ │  Matching    │    ││
│  │  │   Module     │ │   Module     │ │   Module     │ │   Module     │    ││
│  │  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘    ││
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐    ││
│  │  │   Billing    │ │   Candidate  │ │   Search     │ │ Notification │    ││
│  │  │   Module     │ │   Module     │ │   Module     │ │   Module     │    ││
│  │  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘    ││
│  └─────────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        │                       │                       │
        ▼                       ▼                       ▼
┌───────────────┐     ┌───────────────┐     ┌───────────────┐
│   RabbitMQ    │     │    Redis      │     │  PostgreSQL   │
│  Message Bus  │     │    Cache      │     │   Database    │
└───────┬───────┘     └───────────────┘     └───────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           WORKER LAYER                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        │
│  │ CV Parser    │ │   Matching   │ │   Billing    │ │Notification  │        │
│  │   Worker     │ │   Worker     │ │   Worker     │ │   Worker     │        │
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘        │
└─────────────────────────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         EXTERNAL SERVICES                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        │
│  │  AWS S3/     │ │   Stripe     │ │  SendGrid    │ │   Future:    │        │
│  │  MinIO       │ │   Billing    │ │   Email      │ │ Elasticsearch│        │
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘        │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Technology Stack

| Layer               | Technology                   | Purpose                                  |
| ------------------- | ---------------------------- | ---------------------------------------- |
| **Frontend**        | React 19 + TypeScript + Vite | Candidate & Recruiter web applications   |
| **GraphQL Client**  | Apollo Client                | State management, caching, subscriptions |
| **Backend API**     | NestJS + Apollo Server 4     | GraphQL API with modular architecture    |
| **REST Endpoints**  | NestJS Controllers           | Webhooks, health checks, OAuth callbacks |
| **Database**        | PostgreSQL 16+               | Primary data store with ACID compliance  |
| **ORM**             | Prisma                       | Type-safe database access                |
| **Cache**           | Redis 7+                     | Session cache, rate limiting, pub/sub    |
| **Message Queue**   | RabbitMQ 3.x                 | Async job processing, retry queues       |
| **Storage**         | AWS S3 / MinIO               | CV storage, company logos, assets        |
| **Payments**        | Stripe                       | Subscriptions, invoicing, webhook events |
| **Email**           | SendGrid                     | Transactional emails, notifications      |
| **Search (Future)** | Elasticsearch                | Full-text search, faceted filtering      |

### 2.3 API Architecture

#### 2.3.1 Hybrid API Approach

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              API LAYER                                   │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌────────────────────────────┐    ┌────────────────────────────────┐ │
│  │      GRAPHQL API           │    │        REST ENDPOINTS           │ │
│  │      (Primary)             │    │        (Secondary)              │ │
│  │                            │    │                                │ │
│  │  • All CRUD operations     │    │  • POST /webhooks/stripe       │ │
│  │  • Real-time subscriptions  │    │  • GET/POST /webhooks/oauth/*  │ │
│  │  • Field-level auth        │    │  • GET /health                 │ │
│  │  • Query complexity limits  │    │  • GET /ready                  │ │
│  │  • DataLoader for N+1       │    │  • POST /upload/* (alternative)│ │
│  └────────────────────────────┘    └────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

#### 2.3.2 GraphQL Request Flow

```
Client Query → Apollo Server → Auth Directive → Resolver → Service → PostgreSQL
                                    ↓                           ↓
                              Tenant Context             DataLoader
                                    ↓                           ↓
                              Field Auth                   Redis Cache
                                    ↓
                            Query Complexity Check
```

#### 2.3.3 Real-Time Subscriptions Flow

```
Client Subscribe → WebSocket Connection → Subscription Resolver → Redis Pub/Sub
                                                                    ↓
                                                          Service Publishes Event
                                                                    ↓
                                                          Subscription Notifies Client
```

#### 2.3.4 Asynchronous Processing Flow (Background Jobs)

```
GraphQL Mutation → Resolver → Service → Publish to RabbitMQ → Response (202 Accepted)
                                                    ↓
                                           Worker Picks Up Job
                                                    ↓
                                           Process (CV Parse/Matching/Billing)
                                                    ↓
                                           Update Database + Publish to Redis
                                                    ↓
                                           Subscription notifies clients
                                                    ↓
                                           Email Worker → SendGrid
```

#### 2.3.5 REST Webhook Flow (Stripe)

```
Stripe Event → POST /webhooks/stripe → Signature Verification → Queue Job → Response (200)
                                                                    ↓
                                                           Billing Worker
                                                                    ↓
                                                           Update Database
                                                                    ↓
                                                           Publish GraphQL Event
```

---

## 3. Functional Requirements

### 3.1 Authentication & Authorization Module

#### 3.1.1 Requirement: User Registration

**Priority:** P0 (Critical)
**Category:** Authentication
**Stakeholders:** Candidates, Recruiters

**Description:**
Users must be able to register as either a Candidate or Recruiter. The registration process collects minimal required information and verifies the email address before account activation.

**Functional Specifications:**

| Field        | Candidate | Recruiter | Validation Rules                                   |
| ------------ | --------- | --------- | -------------------------------------------------- |
| Email        | Required  | Required  | Valid email format, unique across system           |
| Password     | Required  | Required  | Min 8 chars, 1 uppercase, 1 number, 1 special char |
| First Name   | Required  | Required  | 2-50 characters, letters only                      |
| Last Name    | Required  | Required  | 2-50 characters, letters only                      |
| Company Name | N/A       | Required  | 2-100 characters                                   |
| Role Title   | N/A       | Optional  | 2-50 characters                                    |
| Account Type | Required  | Required  | Enum: [candidate, recruiter]                       |

**Registration Flow:**

1. User selects account type (Candidate/Recruiter)
2. User fills registration form
3. System validates input against validation rules
4. System checks email uniqueness
5. System hashes password using bcrypt (cost factor: 12)
6. System creates user record with status: `pending_verification`
7. System generates verification token (UUID, expires in 24 hours)
8. System sends verification email via SendGrid
9. User clicks verification link
10. System validates token (not expired, exists)
11. System updates user status to `active`
12. System redirects user to onboarding flow

**Error Scenarios:**

| Scenario                | Response                                          | Retry Limit    |
| ----------------------- | ------------------------------------------------- | -------------- |
| Duplicate email         | 409 Conflict, message: "Email already registered" | N/A            |
| Invalid password format | 400 Bad Request, specific validation messages     | N/A            |
| Token expired           | 410 Gone, redirect to resend verification         | 3 resends/hour |
| Token invalid           | 400 Bad Request, redirect to support              | N/A            |

**Implementation Steps:**

1. **Phase 1: Core Registration**
   - Design user schema with email, password_hash, status, account_type
   - Implement password hashing service using bcrypt
   - Create registration DTO with validation decorators
   - Implement user repository with CRUD operations
   - Create registration controller endpoint (POST /auth/register)
   - Add email uniqueness constraint on database level

2. **Phase 2: Email Verification**
   - Create verification_tokens table (token, user_id, expires_at)
   - Implement token generation service (UUID v4)
   - Create email template for verification
   - Integrate with SendGrid API for sending emails
   - Create verification endpoint (GET /auth/verify/:token)
   - Implement token validation and expiration logic
   - Add rate limiting on verification requests

3. **Phase 3: Security Hardening**
   - Implement password breach check via HaveIBeenPwned API (k-anonymity)
   - Add CAPTCHA on registration form (reCAPTCHA v3)
   - Implement rate limiting per IP (10 requests/minute)
   - Add request logging for audit trail
   - Implement honeypot field for bot detection

---

#### 3.1.2 Requirement: User Login

**Priority:** P0 (Critical)
**Category:** Authentication

**Description:**
Registered users with verified emails can authenticate using email and password. The system issues JWT tokens for session management.

**Functional Specifications:**

| Parameter               | Requirement                           |
| ----------------------- | ------------------------------------- |
| Authentication Method   | Email + Password                      |
| Session Type            | JWT-based stateless sessions          |
| Access Token Lifetime   | 15 minutes                            |
| Refresh Token Lifetime  | 7 days (30 days for "Remember Me")    |
| Max Concurrent Sessions | 5 per user                            |
| Failed Attempt Lockout  | 5 failed attempts → 15-minute lockout |

**Login Flow:**

1. User submits email and password
2. System checks rate limiting (max 5 attempts per 15 minutes per IP)
3. System retrieves user by email
4. System verifies user exists and status is `active`
5. System checks if account is locked
6. System compares password hash using bcrypt
7. On failure: increment failed_attempts counter
8. On success: reset failed_attempts, generate tokens
9. System creates refresh token record with device info
10. System returns access token (HTTP-only cookie) + refresh token
11. System logs successful login (audit trail)

**Token Structure:**

```
Access Token Payload:
{
  "sub": "user_uuid",
  "email": "user@email.com",
  "account_type": "candidate|recruiter",
  "tenant_id": "company_uuid|null",
  "role": "user|admin",
  "iat": 1234567890,
  "exp": 1234567890
}

Refresh Token:
{
  "sub": "user_uuid",
  "token_family": "uuid",
  "iat": 1234567890,
  "exp": 1234567890
}
```

**Implementation Steps:**

1. **Phase 1: Basic Authentication**
   - Create authentication service with password comparison
   - Implement JWT token generation service
   - Create login endpoint (POST /auth/login)
   - Configure passport-local strategy
   - Implement JWT strategy for protected routes
   - Create AuthGuard decorator for route protection

2. **Phase 2: Refresh Token Rotation**
   - Create refresh_tokens table (token, user_id, device_info, expires_at, family_id)
   - Implement refresh token generation with family tracking
   - Create refresh endpoint (POST /auth/refresh)
   - Implement token rotation (invalidate old, issue new)
   - Detect and handle token reuse attacks (invalidate family)
   - Store hashed refresh tokens in database

3. **Phase 3: Session Management**
   - Create sessions table for tracking active sessions
   - Implement device fingerprinting (user-agent, IP hash)
   - Add concurrent session limit enforcement
   - Create session listing endpoint (GET /auth/sessions)
   - Implement session revocation (DELETE /auth/sessions/:id)
   - Add "Revoke all sessions" functionality

4. **Phase 4: Security Features**
   - Implement failed attempt tracking with lockout
   - Add suspicious login detection (new device/location)
   - Send email notification for new device login
   - Implement IP-based rate limiting
   - Add CAPTCHA trigger after 3 failed attempts

---

#### 3.1.3 Requirement: Password Reset

**Priority:** P0 (Critical)
**Category:** Authentication

**Description:**
Users can request a password reset via email. The reset token is time-limited and single-use.

**Functional Specifications:**

| Parameter             | Requirement          |
| --------------------- | -------------------- |
| Reset Token Lifetime  | 1 hour               |
| Token Type            | UUID v4, single-use  |
| Max Reset Requests    | 3 per hour per email |
| Password Requirements | Same as registration |

**Password Reset Flow:**

1. User requests password reset with email
2. System checks rate limiting
3. System always returns success message (security: don't reveal if email exists)
4. If email exists: generate reset token, send email
5. User clicks reset link in email
6. System validates token (exists, not expired, not used)
7. User enters new password
8. System hashes new password
9. System invalidates all existing sessions for user
10. System sends password change notification email
11. User can now log in with new password

**Implementation Steps:**

1. **Phase 1: Core Reset Flow**
   - Create password_reset_tokens table (token, user_id, expires_at, used_at)
   - Implement reset request endpoint (POST /auth/forgot-password)
   - Create reset token generation service
   - Design password reset email template
   - Create reset validation endpoint (GET /auth/reset-password/:token)
   - Create password update endpoint (POST /auth/reset-password/:token)
   - Add token invalidation after use

2. **Phase 2: Security**
   - Implement rate limiting on forgot-password endpoint
   - Add CAPTCHA after 2 reset requests
   - Log all password reset attempts
   - Send notification email on password change
   - Invalidate all active sessions on password change
   - Implement token cleanup job (expired tokens)

---

#### 3.1.4 Requirement: OAuth Integration (Future)

**Priority:** P2 (Post-MVP)
**Category:** Authentication

**Description:**
Allow users to authenticate via OAuth providers (LinkedIn, Google) for faster onboarding.

**Supported Providers:**

| Provider | Use Case                             | Priority |
| -------- | ------------------------------------ | -------- |
| LinkedIn | Professional network, profile import | P2       |
| Google   | General authentication               | P2       |
| GitHub   | Developer candidates                 | P3       |

**OAuth Flow:**

1. User clicks "Continue with LinkedIn"
2. System redirects to OAuth provider
3. User authenticates with provider
4. Provider redirects back with authorization code
5. System exchanges code for access token
6. System retrieves user profile from provider
7. If email exists: link to existing account
8. If new: create account with OAuth data
9. Generate JWT tokens for platform session

**Implementation Steps:**

1. **Phase 1: LinkedIn OAuth**
   - Register app with LinkedIn Developer Portal
   - Implement OAuth 2.0 authorization code flow
   - Create oauth_accounts table (provider, provider_user_id, user_id)
   - Implement account linking logic
   - Handle profile data extraction (name, email, profile photo)
   - Create callback endpoint for OAuth provider

2. **Phase 2: Multi-Provider**
   - Abstract OAuth service for multiple providers
   - Add Google OAuth support
   - Implement provider disconnection
   - Handle edge cases (email conflict between providers)

---

#### 3.1.5 Requirement: Two-Factor Authentication (Future)

**Priority:** P3 (Post-MVP)
**Category:** Authentication

**Description:**
Optional two-factor authentication for enhanced account security, especially for Enterprise tier recruiters.

**Supported Methods:**

| Method                   | Use Case      | Priority |
| ------------------------ | ------------- | -------- |
| TOTP (Authenticator App) | Standard 2FA  | P3       |
| SMS OTP                  | Backup method | P4       |
| Email OTP                | Fallback      | P3       |

**2FA Flow:**

1. User enables 2FA in security settings
2. System generates TOTP secret
3. User scans QR code with authenticator app
4. User enters first code to verify setup
5. System stores encrypted secret
6. On subsequent logins: prompt for 2FA code
7. System validates TOTP code (30-second window)
8. On success: complete authentication

---

### 3.2 Tenant & User Management Module

#### 3.2.1 Requirement: Multi-Tenant Architecture

**Priority:** P0 (Critical)
**Category:** Core Infrastructure

**Description:**
The platform operates on a multi-tenant architecture where each company (Tenant) has logically isolated data. All database queries must enforce tenant boundaries to prevent data leakage.

**Tenant Model:**

| Entity              | Attributes                                                                |
| ------------------- | ------------------------------------------------------------------------- |
| **Tenant**          | id, name, slug, plan_id, status, created_at, updated_at, settings (JSONB) |
| **Tenant User**     | id, user_id, tenant_id, role, invited_by, joined_at                       |
| **Tenant Settings** | branding (colors, logo), features (enabled modules), limits (quotas)      |

**Tenant Roles:**

| Role          | Permissions                                                       |
| ------------- | ----------------------------------------------------------------- |
| **Owner**     | Full access, billing management, member management, delete tenant |
| **Admin**     | Member management, all recruiter permissions                      |
| **Recruiter** | Post jobs, view candidates, manage applications                   |
| **Viewer**    | Read-only access to dashboard (Enterprise tier)                   |

**Data Isolation Strategy:**

1. **Application-Level Isolation**
   - The platform uses a **Database-per-tenant** (Siloed) architecture.
   - A central "Control Plane" database stores tenant metadata and database connection strings.
   - Connection routing logic dynamically establishes connections to the specific tenant's database based on the request context.

2. **Database-Level Isolation**
   - Total physical separation of data. Each tenant resides in their own distinct PostgreSQL database or schema.
   - No `tenant_id` columns are needed in tenant-scoped tables.
   - No complex Row-Level Security (RLS) is required, as cross-tenant queries are physically impossible by default.

3. **API-Level Isolation**
   - JWT includes a `tenant_id` claim.
   - Request context extracts the tenant from the JWT.
   - Tenant middleware looks up the tenant's database URL and injects the specific database client instance into the request lifecycle.

**Tenant Context Flow:**

```
Request → AuthGuard → Extract JWT → Get tenant_id from JWT
                                    ↓
                              Lookup DB Connection (Control Plane DB)
                                    ↓
                              Initialize/Retrieve Tenant DB Connection Pool
                                    ↓
                              Controller/Service executes against Tenant DB
```

**Implementation Steps:**

1. **Phase 1: Control Plane & Dynamic Routing**
   - Create central `tenants` table with `database_url` fields.
   - Implement dynamic database connection pooling logic in NestJS.
   - Remove `tenant_id` columns from existing tenant-scoped models.

2. **Phase 2: Tenant Context**
   - Implement AsyncLocalStorage for tenant DB connections.
   - Create TenantConnection service for accessing the current tenant's Prisma instance.
   - Create TenantInterceptor for automatic connection binding.

3. **Phase 3: Database Provisioning**
   - Create automated application-level logic to provision new PostgreSQL databases/schemas upon tenant signup.
   - Run initial schema migrations programmatically when a new tenant registers.

4. **Phase 4: Optimization**
   - Implement connection pool lifecycle management (close inactive connections).
   - Add tenant connection details caching in Redis (reduce Control Plane DB queries).

---

#### 3.2.2 Requirement: Team Invitation System

**Priority:** P1 (High)
**Category:** User Management

**Description:**
Tenant owners and admins can invite team members via email. Invitations expire after a configurable period.

**Invitation Model:**

| Field      | Type      | Description                             |
| ---------- | --------- | --------------------------------------- |
| id         | UUID      | Unique identifier                       |
| email      | string    | Invitee email                           |
| tenant_id  | UUID      | Target tenant                           |
| role       | enum      | invited role (admin, recruiter, viewer) |
| invited_by | UUID      | User who sent invitation                |
| token      | UUID      | Unique invitation token                 |
| status     | enum      | pending, accepted, expired, cancelled   |
| expires_at | timestamp | Expiration time (default: 7 days)       |
| created_at | timestamp | Creation time                           |

**Invitation Flow:**

1. Admin enters invitee email and selects role
2. System validates admin has permission to invite
3. System checks if email already has pending invitation
4. System checks if email is already a team member
5. System creates invitation record with token
6. System sends invitation email with magic link
7. Invitee clicks link (new or existing user)
8. If new user: redirect to registration with pre-filled email
9. If existing user: prompt to accept invitation
10. User accepts invitation
11. System creates tenant_user relationship
12. System sends notification to inviter

**Implementation Steps:**

1. **Phase 1: Core Invitation**
   - Create invitations table
   - Implement invitation creation endpoint
   - Create invitation email template
   - Implement invitation acceptance flow
   - Add invitation listing endpoint
   - Implement invitation cancellation

2. **Phase 2: Role Management**
   - Implement role-based permission system
   - Create permission guards for each role
   - Add role change functionality
   - Implement role removal (self-removal, admin removal)
   - Add activity logging for role changes

3. **Phase 3: Invitation Limits**
   - Add team size limits per subscription tier
   - Implement invitation quota enforcement
   - Show remaining invitations in settings
   - Handle upgrade flow for more seats

---

#### 3.2.3 Requirement: User Profile Management

**Priority:** P1 (High)
**Category:** User Management

**Description:**
Users can manage their profile information including personal details, preferences, and account settings.

**Profile Sections:**

**A. Personal Information**

| Field         | Candidate     | Recruiter     | Validation       |
| ------------- | ------------- | ------------- | ---------------- |
| First Name    | Required      | Required      | 2-50 chars       |
| Last Name     | Required      | Required      | 2-50 chars       |
| Email         | Read-only     | Read-only     | Valid email      |
| Phone         | Optional      | Optional      | E.164 format     |
| Location      | Optional      | Optional      | City, Country    |
| Timezone      | Auto-detected | Auto-detected | IANA timezone    |
| Profile Photo | Optional      | Optional      | Max 2MB, jpg/png |

**B. Candidate-Specific Fields**

| Field               | Description                           |
| ------------------- | ------------------------------------- |
| Headline            | Professional headline (2-100 chars)   |
| Summary             | Professional summary (max 1000 chars) |
| Skills              | Array of skill names with proficiency |
| Experience Level    | Entry/Mid/Senior/Executive            |
| Work Preferences    | Remote, Hybrid, On-site               |
| Visa Status         | Visa requirements by country          |
| Relocation          | Willingness to relocate               |
| Salary Expectations | Min/Max/Currency                      |

**C. Recruiter-Specific Fields**

| Field            | Description              |
| ---------------- | ------------------------ |
| Job Title        | Recruiter's position     |
| Department       | Team/department          |
| LinkedIn Profile | Professional profile URL |

**Implementation Steps:**

1. **Phase 1: Core Profile**
   - Create user_profiles table with JSONB for flexible fields
   - Implement profile CRUD endpoints
   - Add file upload for profile photos (S3 integration)
   - Implement image resizing (thumbnail, medium, full)
   - Add profile completion percentage tracking

2. **Phase 2: Candidate Profile Extensions**
   - Create skills table with many-to-many relation
   - Implement skill suggestions from predefined list
   - Add work preferences form with validation
   - Create visa requirements by country reference table
   - Implement salary range with currency support

3. **Phase 3: Privacy Controls**
   - Add profile_visibility field (public, private, anonymous)
   - Implement field-level visibility controls
   - Add "appear in search" toggle
   - Implement data download functionality (GDPR)

---

### 3.3 Candidate Module

#### 3.3.1 Requirement: CV Upload & Management

**Priority:** P0 (Critical)
**Category:** Candidate Features

**Description:**
Candidates can upload multiple CVs/resumes. The system parses CVs asynchronously to extract structured data for matching.

**CV Model:**

| Field        | Type      | Description                      |
| ------------ | --------- | -------------------------------- |
| id           | UUID      | Unique identifier                |
| user_id      | UUID      | Owner                            |
| file_name    | string    | Original filename                |
| file_path    | string    | S3 key                           |
| file_size    | integer   | Size in bytes                    |
| file_type    | string    | MIME type                        |
| status       | enum      | pending, parsing, parsed, failed |
| parsed_data  | JSONB     | Extracted structured data        |
| is_primary   | boolean   | Default CV flag                  |
| created_at   | timestamp | Upload time                      |
| last_used_at | timestamp | Last application time            |

**Supported Formats:**

| Format | Max Size | Parser                        |
| ------ | -------- | ----------------------------- |
| PDF    | 5MB      | pdf-parse + custom extraction |
| DOCX   | 5MB      | mammoth.js                    |
| DOC    | 5MB      | Convert to DOCX first         |

**Upload Flow:**

1. User selects file to upload
2. Frontend validates file type and size
3. Frontend requests presigned URL from API
4. API generates presigned URL (expires in 5 minutes)
5. Frontend uploads directly to S3
6. S3 triggers event notification or frontend confirms upload
7. API creates CV record with status: pending
8. API publishes CV_PARSE job to RabbitMQ
9. API returns CV record to frontend
10. Worker picks up job, downloads file from S3
11. Worker parses CV, extracts structured data
12. Worker updates CV record with parsed_data
13. Worker triggers profile enrichment job
14. Worker notifies user of parsing completion

**CV Parsing Extraction:**

```json
{
  "contact": {
    "emails": ["user@email.com"],
    "phones": ["+1234567890"],
    "locations": ["City, Country"]
  },
  "education": [
    {
      "institution": "University Name",
      "degree": "Bachelor of Science",
      "field": "Computer Science",
      "start_date": "2015-09",
      "end_date": "2019-06",
      "gpa": "3.8"
    }
  ],
  "experience": [
    {
      "company": "Company Name",
      "title": "Job Title",
      "start_date": "2019-07",
      "end_date": null,
      "is_current": true,
      "location": "City, Country",
      "description": "Job description...",
      "highlights": ["Achievement 1", "Achievement 2"]
    }
  ],
  "skills": [
    { "name": "JavaScript", "confidence": 0.95 },
    { "name": "React", "confidence": 0.9 }
  ],
  "languages": ["English", "Spanish"],
  "certifications": ["AWS Solutions Architect"],
  "summary": "Professional summary extracted from CV..."
}
```

**Implementation Steps:**

1. **Phase 1: Basic Upload**
   - Configure S3 bucket with private access
   - Implement presigned URL generation endpoint
   - Create CVs table with metadata fields
   - Implement direct upload to S3
   - Add file type validation (server-side)
   - Create CV listing/management endpoints

2. **Phase 2: CV Parsing Worker**
   - Create RabbitMQ queue: cv.parse
   - Implement CV parse worker
   - Integrate PDF parsing library
   - Add DOCX support
   - Implement text extraction and cleaning
   - Create parsing result storage
   - Add error handling and retry logic

3. **Phase 3: AI Extraction**
   - Integrate with AI service (OpenAI/Anthropic/custom)
   - Design extraction prompts for structured data
   - Implement skill normalization
   - Add experience parsing with date extraction
   - Implement education parsing
   - Add confidence scoring for extractions
   - Store parsed data in JSONB column

4. **Phase 4: CV Management**
   - Implement multiple CVs per user
   - Add primary CV selection
   - Create CV version history
   - Implement CV deletion with S3 cleanup
   - Add CV usage tracking (applications)
   - Implement CV download endpoint

---

#### 3.3.2 Requirement: Job Discovery

**Priority:** P0 (Critical)
**Category:** Candidate Features

**Description:**
Candidates can search and discover jobs through multiple channels: search, recommendations, and direct browsing.

**Discovery Channels:**

| Channel             | Description                             |
| ------------------- | --------------------------------------- |
| **Search**          | Full-text search with filters           |
| **Recommendations** | AI-scored personalized job suggestions  |
| **Browse**          | Category/location-based browsing        |
| **Alerts**          | Saved searches with email notifications |

**Search Filters:**

| Filter           | Type    | Description                               |
| ---------------- | ------- | ----------------------------------------- |
| Keywords         | Text    | Full-text search on title/description     |
| Location         | Geo     | City, country, radius                     |
| Remote           | Boolean | Remote/hybrid/on-site                     |
| Job Type         | Enum    | Full-time, Part-time, Contract, Freelance |
| Experience       | Range   | Entry to Executive                        |
| Salary           | Range   | Min/max salary                            |
| Visa Sponsorship | Boolean | Jobs offering visa support                |
| Date Posted      | Range   | Last 24h, 7d, 30d                         |
| Company          | Text    | Filter by company name                    |

**Search Implementation:**

**MVP Phase (PostgreSQL JSONB):**

- Store job metadata as JSONB for flexible querying
- Use GIN indexes for JSONB queries
- Implement full-text search with tsvector
- Add trigram indexes for fuzzy matching

**Future Phase (Elasticsearch):**

- Migrate to Elasticsearch for advanced search
- Implement faceted search with aggregations
- Add relevance scoring customization
- Enable synonym handling

**Implementation Steps:**

1. **Phase 1: Basic Search**
   - Design job search query with filters
   - Create composite indexes for common queries
   - Implement pagination (cursor-based for infinite scroll)
   - Add sorting options (relevance, date, salary)
   - Implement search result caching

2. **Phase 2: Advanced Filters**
   - Implement geo-radius search with PostGIS
   - Add salary range filtering
   - Implement multi-select filters
   - Add filter combination logic (AND/OR)
   - Create filter count aggregations

3. **Phase 3: Job Recommendations**
   - Create job_recommendations table (pre-computed)
   - Implement matching score calculation
   - Create recommendation refresh worker
   - Add recommendation explanation
   - Implement "Not interested" feedback

4. **Phase 4: Job Alerts**
   - Create saved_searches table
   - Implement alert scheduling (daily/weekly)
   - Create alert email template
   - Add alert preferences in user settings
   - Implement alert unsubscribe

---

#### 3.3.3 Requirement: Job Application

**Priority:** P0 (Critical)
**Category:** Candidate Features

**Description:**
Candidates can apply to jobs with their CV and cover letter. Applications are tracked through a defined funnel.

**Application Model:**

| Field          | Type      | Description                           |
| -------------- | --------- | ------------------------------------- |
| id             | UUID      | Unique identifier                     |
| candidate_id   | UUID      | Applicant user ID                     |
| job_id         | UUID      | Job reference                         |
| cv_id          | UUID      | CV used for application               |
| cover_letter   | text      | Optional cover letter text            |
| custom_answers | JSONB     | Answers to job-specific questions     |
| status         | enum      | Application status                    |
| status_history | JSONB     | Status change history                 |
| match_score    | decimal   | AI match score at time of application |
| source         | enum      | Direct, recommendation, alert         |
| created_at     | timestamp | Application time                      |
| updated_at     | timestamp | Last update                           |

**Application Status Workflow:**

```
DRAFT → SUBMITTED → SCREENING → INTERVIEW → OFFERED → HIRED
                                        ↓
                                   REJECTED
                                        ↓
                                   WITHDRAWN
```

| Status    | Description                        | Candidate Visible |
| --------- | ---------------------------------- | ----------------- |
| DRAFT     | Application started, not submitted | Yes               |
| SUBMITTED | Application received by recruiter  | Yes               |
| SCREENING | Under initial review               | Yes               |
| INTERVIEW | Invited for interview              | Yes               |
| OFFERED   | Job offer extended                 | Yes               |
| HIRED     | Successfully hired                 | Yes               |
| REJECTED  | Application declined               | Yes               |
| WITHDRAWN | Candidate withdrew                 | Yes               |

**Application Flow:**

1. Candidate views job detail page
2. Candidate clicks "Apply"
3. System checks eligibility (already applied? job closed?)
4. Candidate selects CV (primary or specific)
5. Candidate writes cover letter (optional)
6. Candidate answers custom questions (if any)
7. System calculates match score
8. System creates application with status: SUBMITTED
9. System sends confirmation email
10. System publishes APPLICATION_CREATED event
11. Recruiter sees new application in dashboard

**Application Limits:**

| Tier    | Applications/Month | Daily Limit |
| ------- | ------------------ | ----------- |
| Free    | 10                 | 3           |
| Premium | Unlimited          | 20          |

**Implementation Steps:**

1. **Phase 1: Core Application**
   - Create applications table
   - Implement application creation endpoint
   - Add duplicate application check
   - Implement CV selection
   - Create application retrieval endpoints
   - Add application status listing

2. **Phase 2: Application Funnel**
   - Create status_history table
   - Implement status transition validation
   - Add status update endpoints (recruiter-side)
   - Implement status change notifications
   - Create application timeline view

3. **Phase 3: Custom Questions**
   - Create job_questions table
   - Add question types (text, select, multi-select)
   - Implement question answering in application
   - Store answers in custom_answers JSONB
   - Create validation rules per question

4. **Phase 4: Application Management**
   - Implement application withdrawal
   - Add application archive functionality
   - Create application statistics for candidates
   - Implement follow-up reminders
   - Add feedback collection on rejection

---

### 3.4 Recruiter Module

#### 3.4.1 Requirement: Job Posting

**Priority:** P0 (Critical)
**Category:** Recruiter Features

**Description:**
Recruiters can create, edit, and manage job postings. Jobs go through a defined lifecycle from draft to closed.

**Job Model:**

| Field             | Type      | Description                                |
| ----------------- | --------- | ------------------------------------------ |
| id                | UUID      | Unique identifier                          |
| tenant_id         | UUID      | Company (tenant)                           |
| created_by        | UUID      | Recruiter who created                      |
| title             | string    | Job title (max 100 chars)                  |
| slug              | string    | URL-friendly identifier                    |
| description       | text      | Full job description (HTML)                |
| requirements      | text      | Job requirements                           |
| location          | JSONB     | {city, country, remote_type}               |
| job_type          | enum      | full_time, part_time, contract, freelance  |
| experience_level  | enum      | entry, mid, senior, executive              |
| salary            | JSONB     | {min, max, currency, is_public}            |
| skills            | array     | Required/desired skills                    |
| benefits          | array     | Benefits list                              |
| visa_sponsorship  | boolean   | Offers visa sponsorship                    |
| relocation        | boolean   | Offers relocation support                  |
| questions         | JSONB     | Custom application questions               |
| status            | enum      | draft, published, paused, closed, archived |
| published_at      | timestamp | First publication date                     |
| expires_at        | timestamp | Auto-close date                            |
| application_count | integer   | Number of applications                     |
| created_at        | timestamp | Creation time                              |
| updated_at        | timestamp | Last update                                |

**Job Status Workflow:**

```
DRAFT → PUBLISHED → PAUSED → CLOSED → ARCHIVED
            ↓
        (re-publish)
```

| Status    | Description                      | Visible to Candidates     |
| --------- | -------------------------------- | ------------------------- |
| DRAFT     | Being created/edited             | No                        |
| PUBLISHED | Live and accepting applications  | Yes                       |
| PAUSED    | Temporarily hidden               | No                        |
| CLOSED    | No longer accepting applications | No (or visible as closed) |
| ARCHIVED  | Removed from active list         | No                        |

**Quota Limits:**

| Tier       | Active Jobs    | Draft Limit |
| ---------- | -------------- | ----------- |
| Basic      | 3 active jobs  | 10 drafts   |
| Pro        | 10 active jobs | 25 drafts   |
| Enterprise | Unlimited      | Unlimited   |

**Implementation Steps:**

1. **Phase 1: Job CRUD**
   - Create jobs table with all fields
   - Implement job creation endpoint
   - Add job validation (required fields)
   - Implement slug generation from title
   - Create job editing endpoint
   - Add job deletion (soft delete → archive)

2. **Phase 2: Job Lifecycle**
   - Implement publish endpoint
   - Add status transition validation
   - Implement pause/resume functionality
   - Add auto-expiry job (scheduled task)
   - Create job cloning/duplication

3. **Phase 3: Rich Content**
   - Implement HTML description with sanitization
   - Add skills management with suggestions
   - Implement benefits list
   - Add custom questions support
   - Create job preview functionality

4. **Phase 4: Quota Management**
   - Implement active job count check
   - Add tier limit enforcement
   - Create upgrade prompt on limit
   - Implement job boost feature (paid)
   - Add job analytics tracking

---

#### 3.4.2 Requirement: Candidate Discovery

**Priority:** P0 (Critical)
**Category:** Recruiter Features

**Description:**
Recruiters can search and discover candidates through matching, search, and talent pool features.

**Discovery Methods:**

| Method                   | Description                                     |
| ------------------------ | ----------------------------------------------- |
| **Job Matches**          | Candidates automatically matched to posted jobs |
| **Talent Search**        | Manual search with filters                      |
| **Talent Pool**          | Saved candidates for future reference           |
| **Suggested Candidates** | AI-recommended based on hiring history          |

**Candidate Visibility Model:**

| Profile Field      | Free Tier View  | Paid Tier View |
| ------------------ | --------------- | -------------- |
| Name               | First name only | Full name      |
| Headline           | ✓               | ✓              |
| Skills             | ✓               | ✓              |
| Experience Summary | ✓               | ✓              |
| Location           | City only       | Full location  |
| Contact Info       | ✗               | ✓ (unlocked)   |
| Full Profile       | ✗               | ✓ (unlocked)   |

**Contact Unlock System:**

| Tier       | Monthly Unlocks | Additional Cost |
| ---------- | --------------- | --------------- |
| Basic      | 10              | $5 per unlock   |
| Pro        | 50              | $3 per unlock   |
| Enterprise | Unlimited       | Included        |

**Unlock Flow:**

1. Recruiter views matched/searched candidate
2. Recruiter clicks "Unlock Contact"
3. System checks quota availability
4. System deducts from quota (or charges)
5. System creates unlock record
6. System reveals contact information
7. System notifies candidate (optional based on settings)

**Implementation Steps:**

1. **Phase 1: Matching Display**
   - Create job_candidates table (pre-computed matches)
   - Implement match score display
   - Add match explanation
   - Create candidate card component
   - Implement pagination

2. **Phase 2: Search Functionality**
   - Implement candidate search filters
   - Add skill-based search
   - Implement experience filtering
   - Add location-based search
   - Create search result caching

3. **Phase 3: Contact Unlock**
   - Create contact_unlocks table
   - Implement unlock quota tracking
   - Add unlock endpoint with payment integration
   - Create unlock history
   - Implement unlock expiration (30 days)

4. **Phase 4: Talent Pool**
   - Create talent_pools table
   - Implement candidate saving
   - Add pool organization (folders)
   - Create pool sharing (team)
   - Implement pool notifications

---

#### 3.4.3 Requirement: Application Management

**Priority:** P0 (Critical)
**Category:** Recruiter Features

**Description:**
Recruiters can manage incoming applications, change statuses, communicate with candidates, and track the hiring pipeline.

**Pipeline View:**

```
┌───────────┬───────────┬───────────┬───────────┬───────────┐
│  NEW      │ SCREENING │ INTERVIEW │  OFFER    │  HIRED    │
│  (12)     │  (8)      │  (5)      │  (2)      │  (1)      │
└───────────┴───────────┴───────────┴───────────┴───────────┘
```

**Application Actions:**

| Action   | Description               | Notification                 |
| -------- | ------------------------- | ---------------------------- |
| View     | Open application details  | -                            |
| Advance  | Move to next stage        | Email to candidate           |
| Reject   | Decline application       | Email with optional feedback |
| Withdraw | Remove from pipeline      | -                            |
| Message  | Send message to candidate | In-app + Email               |
| Schedule | Book interview slot       | Email with calendar invite   |
| Offer    | Extend job offer          | Email with offer details     |

**Bulk Actions:**

- Bulk reject
- Bulk advance
- Bulk message
- Export to CSV

**Implementation Steps:**

1. **Phase 1: Pipeline View**
   - Create pipeline stages configuration
   - Implement kanban-style board
   - Add drag-and-drop status change
   - Create application count per stage
   - Implement stage filtering

2. **Phase 2: Application Details**
   - Create detailed application view
   - Display CV with viewer
   - Show match score explanation
   - Display custom question answers
   - Add internal notes feature

3. **Phase 3: Communication**
   - Implement in-app messaging
   - Create email template system
   - Add scheduled messaging
   - Implement message history
   - Create notification preferences

4. **Phase 4: Analytics**
   - Calculate time-in-stage metrics
   - Track conversion rates
   - Create pipeline health dashboard
   - Implement source tracking
   - Add hiring velocity metrics

---

### 3.5 Billing & Subscription Module

#### 3.5.1 Requirement: Subscription Management

**Priority:** P0 (Critical)
**Category:** Billing

**Description:**
The platform operates on a subscription model with tiered plans. Integration with Stripe handles payment processing and webhook events.

**Subscription Plans:**

| Feature           | Free  | Basic  | Pro       | Enterprise |
| ----------------- | ----- | ------ | --------- | ---------- |
| Price             | $0    | $29/mo | $99/mo    | Custom     |
| Active Jobs       | 1     | 3      | 10        | Unlimited  |
| Team Members      | 1     | 2      | 5         | Unlimited  |
| Candidate Unlocks | 0     | 10     | 50        | Unlimited  |
| CV Parsing        | 1     | 10     | Unlimited | Unlimited  |
| Analytics         | Basic | Basic  | Advanced  | Custom     |
| API Access        | ✗     | ✗      | ✓         | ✓          |
| Support           | Email | Email  | Priority  | Dedicated  |

**Subscription Model:**

| Field                  | Type      | Description                          |
| ---------------------- | --------- | ------------------------------------ |
| id                     | UUID      | Unique identifier                    |
| tenant_id              | UUID      | Subscriber (tenant)                  |
| plan_id                | UUID      | Plan reference                       |
| stripe_subscription_id | string    | Stripe subscription ID               |
| stripe_customer_id     | string    | Stripe customer ID                   |
| status                 | enum      | active, past_due, canceled, trialing |
| current_period_start   | timestamp | Billing period start                 |
| current_period_end     | timestamp | Billing period end                   |
| cancel_at              | timestamp | Scheduled cancellation               |
| canceled_at            | timestamp | Actual cancellation time             |
| created_at             | timestamp | Creation time                        |

**Implementation Steps:**

1. **Phase 1: Stripe Integration**
   - Create Stripe account and products
   - Implement customer creation on signup
   - Create checkout session endpoint
   - Handle checkout completion webhook
   - Store subscription details

2. **Phase 2: Plan Management**
   - Create plans table
   - Implement plan comparison
   - Create upgrade/downgrade flow
   - Implement prorated billing
   - Add plan change scheduling

3. **Phase 3: Webhook Handling**
   - Create webhooks table for idempotency
   - Handle all subscription events
   - Implement retry logic
   - Add webhook logging
   - Create failure alerting

4. **Phase 4: Quota Enforcement**
   - Create quota_usage table
   - Implement usage tracking
   - Add quota checks on actions
   - Create usage dashboard
   - Implement overage billing

---

#### 3.5.2 Requirement: Payment Processing

**Priority:** P0 (Critical)
**Category:** Billing

**Description:**
Secure payment processing with proper error handling, retries, and customer communication.

**Payment Flow:**

1. User selects plan
2. System creates Stripe checkout session
3. User redirected to Stripe checkout
4. User enters payment details
5. Stripe processes payment
6. Stripe sends webhook events
7. System updates subscription status
8. User redirected to success page

**Payment Events:**

| Event                         | Action                                 |
| ----------------------------- | -------------------------------------- |
| checkout.session.completed    | Create subscription, activate features |
| invoice.paid                  | Extend subscription period             |
| invoice.payment_failed        | Mark as past_due, send dunning email   |
| customer.subscription.updated | Sync plan changes                      |
| customer.subscription.deleted | Revoke access, send cancellation email |

**Implementation Steps:**

1. **Phase 1: Checkout Flow**
   - Create checkout session endpoint
   - Implement success/cancel URLs
   - Add plan selection UI
   - Create customer portal link

2. **Phase 2: Webhook Processing**
   - Create webhook endpoint
   - Implement signature verification
   - Add idempotency key handling
   - Create event processing queue
   - Handle all critical events

3. **Phase 3: Customer Portal**
   - Integrate Stripe billing portal
   - Allow payment method updates
   - Show invoice history
   - Handle plan changes

4. **Phase 4: Dunning Management**
   - Implement retry schedules
   - Create dunning email sequence
   - Add grace period configuration
   - Implement automatic cancellation

---

### 3.6 Matching System

#### 3.6.1 Requirement: Matching Algorithm

**Priority:** P0 (Critical)
**Category:** Core Feature

**Description:**
AI-powered matching between candidates and jobs based on skills, experience, location, and preferences.

**Matching Score Components:**

| Component    | Weight | Description                                           |
| ------------ | ------ | ----------------------------------------------------- |
| Skills Match | 40%    | Overlap between candidate skills and job requirements |
| Experience   | 25%    | Years and relevance to job                            |
| Location     | 15%    | Geographic match, remote compatibility                |
| Preferences  | 10%    | Work type, salary, visa alignment                     |
| Recency      | 10%    | Profile freshness and activity                        |

**Matching Triggers:**

| Event          | Action                                                   |
| -------------- | -------------------------------------------------------- |
| CV Upload      | Parse CV → Update profile → Recalculate matches          |
| Profile Update | Recalculate matches for candidate                        |
| Job Posted     | Calculate matches for all candidates → Store top matches |
| Job Updated    | Recalculate matches for job                              |

**Matching Flow:**

1. Event triggers matching (CV upload, job post, profile update)
2. System publishes MATCH_CALCULATE job to RabbitMQ
3. Worker picks up job
4. Worker queries candidates with basic filters (location, experience)
5. Worker calculates detailed scores for filtered candidates
6. Worker stores top N matches in job_candidates table
7. Worker publishes MATCH_COMPLETE event
8. Notification worker sends alerts for high matches

**Implementation Steps:**

1. **Phase 1: Basic Matching**
   - Create matching worker skeleton
   - Implement skill matching algorithm
   - Add experience calculation
   - Create match score storage
   - Implement basic filtering

2. **Phase 2: Advanced Matching**
   - Add location proximity scoring
   - Implement preference matching
   - Add salary compatibility check
   - Implement visa sponsorship check
   - Create weighted scoring system

3. **Phase 3: Match Optimization**
   - Add database indexes for common queries
   - Implement caching for frequently accessed profiles
   - Create batch processing for bulk updates
   - Add incremental matching (only recalculate changes)
   - Implement match result pagination

4. **Phase 4: Match Explainability**
   - Create match_explanations table
   - Generate human-readable explanations
   - Display breakdown in UI
   - Add feedback collection
   - Implement match improvement suggestions

---

### 3.7 Notification System

#### 3.7.1 Requirement: Multi-Channel Notifications

**Priority:** P1 (High)
**Category:** User Experience

**Description:**
Deliver notifications through multiple channels (email, in-app, push) with user preferences and delivery tracking.

**Notification Types:**

| Type                      | Email | In-App | Push |
| ------------------------- | ----- | ------ | ---- |
| Application received      | ✓     | ✓      | ✗    |
| Application status change | ✓     | ✓      | ✓    |
| New job match             | ✓     | ✓      | ✓    |
| Job alert                 | ✓     | ✗      | ✗    |
| Payment success           | ✓     | ✓      | ✗    |
| Payment failed            | ✓     | ✓      | ✓    |
| Team invitation           | ✓     | ✓      | ✗    |
| Message received          | ✓     | ✓      | ✓    |

**Notification Model:**

| Field      | Type      | Description                      |
| ---------- | --------- | -------------------------------- |
| id         | UUID      | Unique identifier                |
| user_id    | UUID      | Recipient                        |
| type       | enum      | Notification type                |
| channel    | enum      | email, in_app, push              |
| title      | string    | Notification title               |
| body       | text      | Notification content             |
| data       | JSONB     | Additional data                  |
| status     | enum      | pending, sent, delivered, failed |
| read_at    | timestamp | Read time (in-app)               |
| sent_at    | timestamp | Send time                        |
| created_at | timestamp | Creation time                    |

**Implementation Steps:**

1. **Phase 1: In-App Notifications**
   - Create notifications table
   - Implement notification creation service
   - Create notification listing endpoint
   - Add read/unread status
   - Implement notification bell UI

2. **Phase 2: Email Notifications**
   - Integrate SendGrid
   - Create email templates
   - Implement batch sending
   - Add unsubscribe handling
   - Track delivery and opens

3. **Phase 3: Real-Time Notifications**
   - Set up WebSocket server (Socket.io)
   - Implement room-based connections (user-specific)
   - Create real-time notification push
   - Add connection management
   - Implement reconnection handling

4. **Phase 4: Push Notifications**
   - Integrate Firebase Cloud Messaging (FCM)
   - Implement device token registration
   - Create push notification sending
   - Add notification preferences
   - Implement do-not-disturb scheduling

---

### 3.8 Search System

#### 3.8.1 Requirement: Full-Text Search

**Priority:** P1 (High)
**Category:** Core Feature

**Description:**
Comprehensive search functionality for jobs and candidates with filters, sorting, and pagination.

**Search Capabilities:**

| Capability | Description                              |
| ---------- | ---------------------------------------- |
| Full-text  | Search across title, description, skills |
| Fuzzy      | Handle typos and variations              |
| Faceted    | Filter by multiple attributes            |
| Geo        | Location-based radius search             |
| Relevance  | Rank by match quality                    |

**MVP Implementation (PostgreSQL):**

```sql
-- Full-text search index
CREATE INDEX idx_jobs_search ON jobs USING GIN (
  to_tsvector('english', title || ' ' || description)
);

-- Trigram index for fuzzy matching
CREATE INDEX idx_jobs_title_trgm ON jobs USING GIN (title gin_trgm_ops);

-- JSONB index for skill search
CREATE INDEX idx_jobs_skills ON jobs USING GIN (skills);
```

**Future Implementation (Elasticsearch):**

- Dedicated search cluster
- Real-time indexing
- Advanced relevance tuning
- Synonym handling
- Auto-complete suggestions

**Implementation Steps:**

1. **Phase 1: Basic Search**
   - Implement full-text search query
   - Add keyword highlighting
   - Create search filters
   - Implement pagination
   - Add search logging

2. **Phase 2: Advanced Features**
   - Add geo-radius search with PostGIS
   - Implement facet counts
   - Add search suggestions
   - Create saved searches
   - Implement search analytics

3. **Phase 3: Optimization**
   - Add query result caching
   - Implement search debouncing
   - Create search result prefetching
   - Add A/B testing for relevance

4. **Phase 4: Elasticsearch Migration**
   - Set up Elasticsearch cluster
   - Create index mappings
   - Implement sync workers
   - Migrate search queries
   - Add advanced features

---

## 4. Non-Functional Requirements

### 4.1 Performance Requirements

#### 4.1.1 Response Time

| Endpoint                  | P50     | P95     | P99     |
| ------------------------- | ------- | ------- | ------- |
| Job search                | < 100ms | < 200ms | < 500ms |
| Job detail                | < 50ms  | < 100ms | < 200ms |
| Application submit        | < 100ms | < 200ms | < 400ms |
| Dashboard load            | < 200ms | < 400ms | < 800ms |
| CV upload (presigned URL) | < 50ms  | < 100ms | < 200ms |
| Matching trigger          | < 100ms | < 200ms | < 500ms |

**Implementation Steps:**

1. **Database Optimization**
   - Add indexes on all foreign keys
   - Create composite indexes for common queries
   - Implement query analysis with EXPLAIN ANALYZE
   - Add connection pooling (PgBouncer)
   - Implement read replicas for search queries

2. **Caching Strategy**
   - Cache job listings (Redis, 5-minute TTL)
   - Cache user profiles (Redis, 15-minute TTL)
   - Cache subscription status (Redis, 1-hour TTL)
   - Implement cache invalidation on updates
   - Add cache warming for popular content

3. **API Optimization**
   - Implement request compression (gzip/brotli)
   - Add response pagination
   - Implement field selection (partial responses)
   - Use HTTP/2 for multiplexing
   - Add CDN for static assets

4. **Monitoring & Alerting**
   - Set up APM (Application Performance Monitoring)
   - Create latency dashboards
   - Add performance alerts (P95 > threshold)
   - Implement slow query logging
   - Create performance budgets

---

#### 4.1.2 Throughput

| Metric                     | Target |
| -------------------------- | ------ |
| Concurrent Users           | 10,000 |
| Requests per Second        | 5,000  |
| Background Jobs per Minute | 10,000 |
| WebSocket Connections      | 5,000  |

**Implementation Steps:**

1. **Horizontal Scaling**
   - Design stateless API servers
   - Implement load balancing (round-robin, least connections)
   - Use sticky sessions only for WebSocket
   - Deploy multiple instances behind load balancer
   - Implement auto-scaling based on CPU/memory

2. **Queue Management**
   - Configure RabbitMQ clustering
   - Implement queue prioritization
   - Add consumer scaling (multiple workers)
   - Implement backpressure handling
   - Add queue monitoring and alerting

3. **Database Scaling**
   - Implement read replicas
   - Use connection pooling
   - Configure query timeouts
   - Implement statement timeouts
   - Plan for sharding (future)

---

### 4.2 Scalability Requirements

#### 4.2.1 Horizontal Scaling

**Implementation Steps:**

1. **Stateless Design**
   - Remove all in-memory session state
   - Use Redis for session storage
   - Store all state in external systems
   - Design for shared-nothing architecture

2. **Service Separation**
   - Separate API servers from workers
   - Allow independent scaling
   - Implement graceful shutdown
   - Add health check endpoints

3. **Container Orchestration**
   - Containerize all services (Docker)
   - Use Kubernetes or ECS for orchestration
   - Implement horizontal pod autoscaler
   - Configure resource limits and requests
   - Implement pod disruption budgets

4. **Database Scaling Path**
   - Phase 1: Single instance with connection pooling
   - Phase 2: Read replicas for search queries
   - Phase 3: Citus for horizontal sharding
   - Phase 4: Dedicated search cluster (Elasticsearch)

---

#### 4.2.2 Data Growth

| Entity         | Growth Rate   | Retention                          |
| -------------- | ------------- | ---------------------------------- |
| Jobs           | 10,000/month  | Active: 90 days, Archived: 2 years |
| Applications   | 50,000/month  | Active: 1 year, Archived: 5 years  |
| Users          | 5,000/month   | Indefinite                         |
| Events (Audit) | 500,000/month | 90 days hot, 2 years cold          |

**Implementation Steps:**

1. **Data Partitioning**
   - Partition events by created_at
   - Partition applications by created_at
   - Implement partition pruning
   - Create automated partition management

2. **Archival Strategy**
   - Define hot/warm/cold storage tiers
   - Implement automated archival jobs
   - Move old data to cold storage (S3)
   - Keep recent data in PostgreSQL
   - Implement point-in-time recovery

3. **Index Management**
   - Regular index bloat analysis
   - Implement REINDEX schedules
   - Monitor index usage
   - Remove unused indexes

---

### 4.3 Availability Requirements

#### 4.3.1 Uptime Target

| Tier       | Target | Allowed Downtime |
| ---------- | ------ | ---------------- |
| Free       | 99%    | 3.65 days/year   |
| Paid       | 99.5%  | 1.83 days/year   |
| Enterprise | 99.9%  | 8.76 hours/year  |

**Implementation Steps:**

1. **Redundancy**
   - Multi-AZ database deployment
   - Multiple API server instances
   - Redis Sentinel for HA
   - RabbitMQ clustering

2. **Failover**
   - Database automatic failover
   - API server health checks
   - Worker failure recovery
   - CDN failover for static assets

3. **Disaster Recovery**
   - Daily automated backups
   - Cross-region backup replication
   - Documented recovery procedures
   - Regular recovery drills
   - RPO: 1 hour, RTO: 4 hours

---

#### 4.3.2 Graceful Degradation

| Service Degradation | Fallback Behavior            |
| ------------------- | ---------------------------- |
| Search unavailable  | Return cached results        |
| Matching delayed    | Show "pending" status        |
| WebSocket down      | Fall back to polling         |
| Email service down  | Queue for retry              |
| Payment processing  | Queue for retry, notify user |

**Implementation Steps:**

1. **Circuit Breakers**
   - Implement circuit breaker pattern
   - Configure failure thresholds
   - Add fallback responses
   - Implement half-open state testing

2. **Queue-Based Resilience**
   - All critical actions queued
   - Retry with exponential backoff
   - Dead letter queues for failed jobs
   - Manual replay capability

---

### 4.4 Security Requirements

#### 4.4.1 Authentication Security

| Requirement           | Implementation               |
| --------------------- | ---------------------------- |
| Password hashing      | bcrypt, cost factor 12       |
| Session timeout       | 15 min access, 7 day refresh |
| Concurrent sessions   | Max 5 per user               |
| Failed login lockout  | 5 attempts → 15 min lockout  |
| Password breach check | HaveIBeenPwned k-anonymity   |
| 2FA                   | Optional TOTP (future)       |

**Implementation Steps:**

1. **Password Security**
   - Implement bcrypt hashing
   - Add password strength validation
   - Integrate breach check API
   - Implement password history (no reuse)

2. **Session Security**
   - Use HTTP-only, secure cookies
   - Implement refresh token rotation
   - Add device fingerprinting
   - Create session invalidation API

3. **Brute Force Protection**
   - Implement rate limiting per IP
   - Add progressive delays
   - Implement CAPTCHA triggers
   - Log suspicious activity

---

#### 4.4.2 Data Security

| Requirement           | Implementation                              |
| --------------------- | ------------------------------------------- |
| Encryption at rest    | AES-256 for S3, PostgreSQL encryption       |
| Encryption in transit | TLS 1.3 minimum                             |
| PII protection        | Separate PII tables, field-level encryption |
| CV storage            | Private S3 bucket, presigned URLs           |
| Secrets management    | AWS Secrets Manager / HashiCorp Vault       |

**Implementation Steps:**

1. **Data Encryption**
   - Enable S3 server-side encryption
   - Configure TLS certificates
   - Encrypt sensitive fields (SSN, salary)
   - Use secure key management

2. **Access Control**
   - Implement presigned URLs for CV access
   - Time-limited URL expiration (5 minutes)
   - Audit all file access
   - Implement virus scanning on upload

3. **Secrets Management**
   - Migrate from .env to secrets manager
   - Implement secret rotation
   - Use IAM roles for service access
   - Audit secret access

---

#### 4.4.3 API Security

| Requirement      | Implementation                            |
| ---------------- | ----------------------------------------- |
| Rate limiting    | 100 req/min per user, 1000 req/min per IP |
| Input validation | Class-validator DTOs                      |
| SQL injection    | Parameterized queries only                |
| XSS prevention   | Output encoding, CSP headers              |
| CSRF protection  | CSRF tokens for state-changing operations |
| CORS             | Whitelist origins only                    |

**Implementation Steps:**

1. **Rate Limiting**
   - Implement Redis-based rate limiter
   - Configure per-endpoint limits
   - Add burst handling
   - Implement 429 response with retry-after

2. **Input Validation**
   - Create validation DTOs
   - Implement whitelist validation
   - Sanitize all user input
   - Validate file uploads

3. **Security Headers**
   - Add Helmet.js middleware
   - Configure CSP headers
   - Add HSTS header
   - Implement CORS policy

---

### 4.5 Observability Requirements

#### 4.5.1 Logging

| Log Type         | Retention | Destination           |
| ---------------- | --------- | --------------------- |
| Application logs | 30 days   | CloudWatch Logs / ELK |
| Access logs      | 90 days   | S3 + CloudWatch       |
| Audit logs       | 2 years   | S3 Glacier            |
| Error logs       | 90 days   | Sentry + CloudWatch   |

**Log Structure:**

```json
{
  "timestamp": "2026-03-29T10:00:00Z",
  "level": "info",
  "service": "api",
  "trace_id": "abc123",
  "tenant_id": "tenant-uuid",
  "user_id": "user-uuid",
  "action": "job.created",
  "resource": "job",
  "resource_id": "job-uuid",
  "metadata": {
    "title": "Senior Developer",
    "status": "published"
  }
}
```

**Implementation Steps:**

1. **Structured Logging**
   - Implement winston or pino logger
   - Add correlation IDs (trace_id)
   - Include tenant context
   - Configure log levels

2. **Log Aggregation**
   - Set up log shipping
   - Configure CloudWatch or ELK
   - Create log indexes
   - Implement log retention policies

3. **Audit Logging**
   - Create audit_events table
   - Log all write operations
   - Include before/after states
   - Implement audit query API

---

#### 4.5.2 Monitoring

| Metric               | Alert Threshold  |
| -------------------- | ---------------- |
| API Error Rate       | > 1%             |
| API Latency (P95)    | > 500ms          |
| Database Connections | > 80% of pool    |
| Queue Depth          | > 10,000 pending |
| Worker Failure Rate  | > 5%             |
| Disk Usage           | > 80%            |

**Implementation Steps:**

1. **Metrics Collection**
   - Implement Prometheus metrics
   - Add custom metrics for business logic
   - Configure metric exporters
   - Set up Grafana dashboards

2. **Health Checks**
   - Create /health endpoint
   - Check database connectivity
   - Check Redis connectivity
   - Check RabbitMQ connectivity
   - Implement readiness/liveness probes

3. **Alerting**
   - Configure alert rules
   - Set up notification channels
   - Create escalation policies
   - Implement on-call rotation

---

#### 4.5.3 Tracing

**Implementation Steps:**

1. **Distributed Tracing**
   - Implement OpenTelemetry
   - Configure trace exporters
   - Add trace sampling (10%)
   - Create service maps

2. **Request Tracking**
   - Generate trace ID on request start
   - Pass trace ID through all services
   - Include in all log entries
   - Add to error responses

---

## 5. Security Requirements

### 5.1 OWASP Top 10 Coverage

| Vulnerability             | Mitigation                                 |
| ------------------------- | ------------------------------------------ |
| Injection                 | Parameterized queries, input validation    |
| Broken Auth               | JWT with rotation, 2FA, rate limiting      |
| Sensitive Data            | Encryption at rest, TLS, PII separation    |
| XXE                       | Disable XML parsing, use JSON              |
| Broken Access             | RBAC, tenant isolation, resource ownership |
| Security Misconfiguration | Hardened configs, security headers         |
| XSS                       | Output encoding, CSP, input sanitization   |
| Insecure Deserialization  | Validate all inputs, use safe parsers      |
| Vulnerable Components     | Dependency scanning, automated updates     |
| Insufficient Logging      | Comprehensive audit logging                |

### 5.2 Security Implementation Steps

1. **Dependency Security**
   - Enable Dependabot
   - Run npm audit in CI
   - Use lock files
   - Review security advisories

2. **Security Testing**
   - Run OWASP ZAP scans
   - Implement penetration testing
   - Security code review process
   - Vulnerability disclosure policy

3. **Incident Response**
   - Document security incident process
   - Create communication templates
   - Define escalation paths
   - Regular incident drills

---

## 6. Compliance & Data Governance

### 6.1 GDPR Compliance

| Requirement            | Implementation                   |
| ---------------------- | -------------------------------- |
| Right to access        | User data export endpoint        |
| Right to erasure       | Account deletion with cascade    |
| Right to portability   | JSON export format               |
| Right to rectification | Profile editing                  |
| Consent management     | Cookie consent, opt-in marketing |
| Data minimization      | Collect only necessary data      |
| Breach notification    | 72-hour notification process     |

**Implementation Steps:**

1. **Data Mapping**
   - Document all PII locations
   - Create data flow diagrams
   - Identify processing purposes
   - Document legal bases

2. **User Rights**
   - Create /user/data-export endpoint
   - Implement account deletion flow
   - Add data rectification UI
   - Document retention periods

3. **Consent Management**
   - Implement cookie consent banner
   - Store consent records
   - Allow consent withdrawal
   - Honor DNT signals

---

### 6.2 Data Retention

| Data Type            | Retention Period                        | Disposal Method            |
| -------------------- | --------------------------------------- | -------------------------- |
| Active user profiles | Duration of account + 30 days           | Soft delete → hard delete  |
| Deleted accounts     | 30 days recovery, then permanent delete | Cascade delete             |
| Application data     | 5 years (legal requirement)             | Archive to cold storage    |
| Payment records      | 7 years (legal requirement)             | Archive                    |
| Audit logs           | 2 years                                 | Archive to S3              |
| CVs                  | Duration of account                     | Delete on account deletion |

---

## 7. Implementation Roadmap

### Phase 1: Foundation (Weeks 1-4)

| Week | Deliverables                                 |
| ---- | -------------------------------------------- |
| 1    | Project setup, database schema, auth module  |
| 2    | User management, tenant isolation, basic API |
| 3    | CV upload, S3 integration, file storage      |
| 4    | Basic job CRUD, application submission       |

### Phase 2: Core Features (Weeks 5-8)

| Week | Deliverables                               |
| ---- | ------------------------------------------ |
| 5    | Matching system, background workers        |
| 6    | Search functionality, filters              |
| 7    | Billing integration, Stripe webhooks       |
| 8    | Subscription management, quota enforcement |

### Phase 3: Polish (Weeks 9-12)

| Week | Deliverables                         |
| ---- | ------------------------------------ |
| 9    | Notification system, email templates |
| 10   | Analytics dashboard, reporting       |
| 11   | Security hardening, rate limiting    |
| 12   | Performance optimization, caching    |

### Phase 4: Launch Prep (Weeks 13-16)

| Week | Deliverables                            |
| ---- | --------------------------------------- |
| 13   | Load testing, performance tuning        |
| 14   | Security audit, penetration testing     |
| 15   | Documentation, API docs                 |
| 16   | Deployment automation, monitoring setup |

---

## 8. Glossary

| Term            | Definition                                            |
| --------------- | ----------------------------------------------------- |
| **Tenant**      | A company/organization using the platform             |
| **Candidate**   | A job seeker using the platform (B2C)                 |
| **Recruiter**   | A hiring professional using the platform (B2B)        |
| **Match Score** | AI-calculated compatibility between candidate and job |
| **Unlock**      | Action to reveal candidate contact information        |
| **Pipeline**    | Visual representation of application statuses         |
| **Webhook**     | HTTP callback for asynchronous event notification     |
| **RLS**         | Row-Level Security in PostgreSQL                      |
| **DTO**         | Data Transfer Object                                  |
| **JWT**         | JSON Web Token                                        |
| **TOTP**        | Time-based One-Time Password                          |
| **APM**         | Application Performance Monitoring                    |

---

**Document End**

_This requirements document serves as the foundation for the TalentSync platform development. All implementation decisions should reference this document for scope and priorities._
