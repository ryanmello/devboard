# Devboard v2 - Development Guide

> New architecture: Next.js frontend + Go (Gin) backend + Supabase (Auth & Postgres)

This document outlines how to rebuild Devboard using the new architecture. Reference `APP.md` for the original feature set.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Repository Structure](#repository-structure)
3. [Technology Stack](#technology-stack)
4. [Database Schema](#database-schema)
5. [Authentication Flow](#authentication-flow)
6. [Go API Development](#go-api-development)
7. [Frontend Development](#frontend-development)
8. [User Profiles](#user-profiles)
9. [External Integrations](#external-integrations)
10. [API Endpoint Specification](#api-endpoint-specification)
11. [Environment Configuration](#environment-configuration)
12. [Development Workflow](#development-workflow)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Browser                          │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Next.js Frontend (/ui)                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │  Pages/App  │  │ Components  │  │  Supabase Auth Client   │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                │
                    Authorization: Bearer <token>
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Go API (Gin Framework)                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   Handlers  │  │ Middleware  │  │    JWT Verification     │  │
│  │  (Routes)   │  │  (Auth)     │  │    (Supabase Secret)    │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Supabase Postgres Database                   │
│  ┌─────────┐  ┌───────────┐  ┌───────────┐  ┌───────────────┐   │
│  │  users  │  │ projects  │  │ education │  │  experience   │   │
│  └─────────┘  └───────────┘  └───────────┘  └───────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Key Principles

1. **Frontend handles auth UI** - Supabase client manages OAuth flows, session tokens
2. **Backend verifies & authorizes** - Go API validates JWT on every protected request
3. **Centralized data access** - All writes and protected reads go through Go API
4. **Public reads can bypass API** - Profile views may read directly from Supabase for performance (optional)

---

## Repository Structure

```
devboard/
├── main.go                    # Go API entrypoint
├── go.mod                     # Go module definition
├── go.sum                     # Go dependencies
├── api/
│   ├── router.go              # Gin router setup
│   └── v1/
│       ├── users.go           # User handlers
│       ├── profile.go         # Profile handlers  
│       ├── projects.go        # Project handlers
│       ├── education.go       # Education handlers
│       ├── experience.go      # Experience handlers
│       └── external.go        # GitHub/LeetCode proxy
├── middleware/
│   ├── auth.go                # JWT verification
│   └── cors.go                # CORS configuration
├── db/
│   ├── connection.go          # GORM/Postgres setup
│   └── models.go              # Database models
├── services/
│   ├── github.go              # GitHub API client
│   └── leetcode.go            # LeetCode API client
├── config/
│   └── config.go              # Environment parsing
├── ui/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── sign-in/
│   │   │   ├── sign-up/
│   │   │   └── auth/callback/
│   │   ├── (site)/
│   │   │   └── page.tsx       # Landing page
│   │   ├── u/
│   │   │   └── [username]/
│   │   │       └── page.tsx   # Public profile page
│   │   ├── settings/
│   │   │   └── page.tsx       # Profile editor
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   ├── profile/           # Profile display components
│   │   ├── settings/          # Settings form components
│   │   └── shared/            # Shared components
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts      # Browser client
│   │   │   └── server.ts      # Server client
│   │   ├── api.ts             # Go API client
│   │   └── utils.ts
│   ├── hooks/
│   │   ├── use-auth.ts        # Auth state hook
│   │   └── use-profile.ts     # Profile data hook
│   ├── types/
│   │   └── index.ts           # TypeScript types
│   ├── .env.example
│   ├── package.json
│   └── next.config.ts
├── .env.example               # Root env for Go API
├── APP.md                     # Original app documentation
├── NEWAPP.md                  # This file
└── REFACTOR.md                # Refactor plan
```

---

## Technology Stack

### Frontend (`/ui`)

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui |
| Auth | Supabase Auth (@supabase/ssr) |
| HTTP Client | Native fetch with wrapper |
| Forms | React Hook Form + Zod |
| State | React hooks / Context |

### Backend (root)

| Layer | Technology |
|-------|------------|
| Framework | Gin |
| Language | Go |
| ORM | GORM |
| Database | Supabase Postgres |
| Auth | JWT verification (Supabase secret) |
| External APIs | GitHub GraphQL, LeetCode Stats |

---

## Database Schema

All tables live in Supabase Postgres. The Go backend uses GORM models that map to these tables.

### users

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT gen_random_uuid() | Primary key (matches Supabase auth.users.id) |
| email | VARCHAR(255) | UNIQUE, NOT NULL | User's email |
| username | VARCHAR(50) | UNIQUE, NOT NULL | URL-safe username for /u/{username} |
| first_name | VARCHAR(100) | | First name |
| last_name | VARCHAR(100) | | Last name |
| image | TEXT | | Profile image URL |
| headline | TEXT | | Short bio/headline |
| resume | TEXT | | Resume file URL |
| role | VARCHAR(20) | DEFAULT 'user' | User role |
| github_username | VARCHAR(100) | | Connected GitHub account |
| leetcode_username | VARCHAR(100) | | Connected LeetCode account |
| linkedin_username | VARCHAR(100) | | Connected LinkedIn account |
| skills | TEXT[] | | Array of skill names |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | |

**Note**: The `id` column should match the Supabase `auth.users.id` for the user. When a user signs up, create a corresponding row in this table.

### projects

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT gen_random_uuid() | |
| user_id | UUID | FK → users.id, ON DELETE CASCADE | |
| name | VARCHAR(255) | NOT NULL | |
| github_url | TEXT | | |
| primary_language | VARCHAR(50) | | |
| description | TEXT | | |
| image | TEXT | | |
| url | TEXT | | Live project URL |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | |

### education

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT gen_random_uuid() | |
| user_id | UUID | FK → users.id, ON DELETE CASCADE | |
| university_name | VARCHAR(255) | NOT NULL | Full university name |
| university_image | TEXT | | University logo URL |
| start_year | VARCHAR(4) | NOT NULL | |
| graduation_year | VARCHAR(4) | NOT NULL | |
| major | VARCHAR(255) | NOT NULL | |
| minor | VARCHAR(255) | | |
| gpa | VARCHAR(10) | | |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | |

**Note**: Changed from `universityId` (referencing hardcoded list) to storing `university_name` and `university_image` directly. This is more flexible and doesn't limit to Sacramento-area colleges.

### experience

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT gen_random_uuid() | |
| user_id | UUID | FK → users.id, ON DELETE CASCADE | |
| company | VARCHAR(255) | NOT NULL | |
| company_image | TEXT | | Company logo URL |
| title | VARCHAR(255) | NOT NULL | |
| start_month | VARCHAR(20) | NOT NULL | |
| start_year | VARCHAR(4) | NOT NULL | |
| end_month | VARCHAR(20) | | Null if current |
| end_year | VARCHAR(4) | | Null if current |
| is_current | BOOLEAN | DEFAULT FALSE | |
| location | VARCHAR(255) | | |
| employment_type | VARCHAR(50) | | Full-time, Part-time, Contract, Internship |
| description | TEXT | | |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | |

### SQL Migration

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    image TEXT,
    headline TEXT,
    resume TEXT,
    role VARCHAR(20) DEFAULT 'user',
    github_username VARCHAR(100),
    leetcode_username VARCHAR(100),
    linkedin_username VARCHAR(100),
    skills TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects table
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    github_url TEXT,
    primary_language VARCHAR(50),
    description TEXT,
    image TEXT,
    url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Education table
CREATE TABLE education (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    university_name VARCHAR(255) NOT NULL,
    university_image TEXT,
    start_year VARCHAR(4) NOT NULL,
    graduation_year VARCHAR(4) NOT NULL,
    major VARCHAR(255) NOT NULL,
    minor VARCHAR(255),
    gpa VARCHAR(10),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Experience table
CREATE TABLE experience (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    company VARCHAR(255) NOT NULL,
    company_image TEXT,
    title VARCHAR(255) NOT NULL,
    start_month VARCHAR(20) NOT NULL,
    start_year VARCHAR(4) NOT NULL,
    end_month VARCHAR(20),
    end_year VARCHAR(4),
    is_current BOOLEAN DEFAULT FALSE,
    location VARCHAR(255),
    employment_type VARCHAR(50),
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_education_user_id ON education(user_id);
CREATE INDEX idx_experience_user_id ON experience(user_id);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_education_updated_at BEFORE UPDATE ON education
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_experience_updated_at BEFORE UPDATE ON experience
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

## Authentication Flow

### Sign Up / Sign In (Frontend)

```
User clicks "Continue with GitHub/Google"
        │
        ▼
Supabase OAuth flow initiates
        │
        ▼
User authenticates with provider
        │
        ▼
Redirect to /auth/callback with code
        │
        ▼
Exchange code for session (access_token + refresh_token)
        │
        ▼
Session stored in cookies via @supabase/ssr
        │
        ▼
Redirect to /settings or onboarding
```

### New User Registration

When a user signs up for the first time:

1. Supabase creates a record in `auth.users`
2. Frontend detects new user (no profile exists)
3. Frontend calls `POST /api/v1/users` with access token to create profile
4. User enters username (validated for uniqueness and banned words)
5. Profile created in `users` table with `id` matching `auth.users.id`

### Authenticated API Requests

The frontend uses an `api` client (`lib/api.ts`) that automatically attaches the Supabase access token to requests:

```typescript
// Example usage in a component
import { api } from '@/lib/api';

// Public endpoint (no auth required)
const profile = await api.getProfile('johndoe');

// Protected endpoint (auth token attached automatically)
const currentUser = await api.getCurrentUser();
await api.updateProfile({ firstName: 'John', lastName: 'Doe' });
await api.createProject({ name: 'My Project', description: '...' });
```

See the full [API Client](#api-client) implementation in the Frontend Development section.

### JWT Verification (Backend)

```go
// middleware/auth.go
package middleware

import (
    "net/http"
    "strings"
    "github.com/gin-gonic/gin"
    "github.com/golang-jwt/jwt/v5"
)

func AuthMiddleware(jwtSecret string) gin.HandlerFunc {
    return func(c *gin.Context) {
        authHeader := c.GetHeader("Authorization")
        if authHeader == "" {
            c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Missing authorization header"})
            return
        }

        tokenString := strings.TrimPrefix(authHeader, "Bearer ")
        
        token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
            return []byte(jwtSecret), nil
        })

        if err != nil || !token.Valid {
            c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
            return
        }

        claims, ok := token.Claims.(jwt.MapClaims)
        if !ok {
            c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid claims"})
            return
        }

        // Extract user ID from 'sub' claim
        userId, ok := claims["sub"].(string)
        if !ok {
            c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid user ID"})
            return
        }

        // Store user ID in context for handlers
        c.Set("userId", userId)
        c.Next()
    }
}
```

### Username Validation

Since user profiles are served at `/u/{username}`, there are no conflicts with top-level routes like `/settings`, `/api`, etc. The only reserved username is `me`, which is used by the API for the authenticated user's endpoints (`/api/v1/users/me`).

```go
func IsUsernameValid(username string) error {
    // Reserved for API
    if strings.ToLower(username) == "me" {
        return errors.New("username 'me' is reserved")
    }
    
    // Basic validation
    if len(username) < 3 || len(username) > 39 {
        return errors.New("username must be 3-39 characters")
    }
    
    // Only alphanumeric and hyphens, cannot start/end with hyphen
    validUsername := regexp.MustCompile(`^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]$`)
    if !validUsername.MatchString(username) {
        return errors.New("username can only contain letters, numbers, and hyphens")
    }
    
    return nil
}
```

---

## Go API Development

### Router Setup

```go
// api/router.go
package api

import (
    "github.com/gin-gonic/gin"
    "devboard/middleware"
    v1 "devboard/api/v1"
)

func SetupRouter(jwtSecret string) *gin.Engine {
    r := gin.Default()
    
    // CORS middleware
    r.Use(middleware.CORS())
    
    // Health check (public)
    r.GET("/health", func(c *gin.Context) {
        c.JSON(200, gin.H{"status": "ok"})
    })
    
    // API v1 routes
    api := r.Group("/api/v1")
    {
        // Public routes
        public := api.Group("")
        {
            public.GET("/users/:username", v1.GetUserByUsername)      // Public profile
            public.GET("/users/:username/github", v1.GetGitHubData)   // GitHub stats
            public.GET("/users/:username/leetcode", v1.GetLeetCodeData) // LeetCode stats
        }
        
        // Protected routes (require auth)
        protected := api.Group("")
        protected.Use(middleware.AuthMiddleware(jwtSecret))
        {
            // User management
            protected.POST("/users", v1.CreateUser)           // Create profile (new signup)
            protected.GET("/users/me", v1.GetCurrentUser)     // Get own profile
            protected.PUT("/users/me", v1.UpdateCurrentUser)  // Update own profile
            protected.DELETE("/users/me", v1.DeleteCurrentUser)
            
            // Skills
            protected.PUT("/users/me/skills", v1.UpdateSkills)
            
            // Projects
            protected.GET("/users/me/projects", v1.GetMyProjects)
            protected.POST("/users/me/projects", v1.CreateProject)
            protected.PUT("/users/me/projects/:id", v1.UpdateProject)
            protected.DELETE("/users/me/projects/:id", v1.DeleteProject)
            
            // Education
            protected.GET("/users/me/education", v1.GetMyEducation)
            protected.POST("/users/me/education", v1.CreateEducation)
            protected.PUT("/users/me/education/:id", v1.UpdateEducation)
            protected.DELETE("/users/me/education/:id", v1.DeleteEducation)
            
            // Experience
            protected.GET("/users/me/experience", v1.GetMyExperience)
            protected.POST("/users/me/experience", v1.CreateExperience)
            protected.PUT("/users/me/experience/:id", v1.UpdateExperience)
            protected.DELETE("/users/me/experience/:id", v1.DeleteExperience)
        }
    }
    
    return r
}
```

### GORM Models

```go
// db/models.go
package db

import (
    "time"
    "github.com/lib/pq"
)

type User struct {
    Id               string         `gorm:"type:uuid;primaryKey" json:"id"`
    Email            string         `gorm:"uniqueIndex;not null" json:"email"`
    Username         string         `gorm:"uniqueIndex;not null" json:"username"`
    FirstName        *string        `json:"firstName"`
    LastName         *string        `json:"lastName"`
    Image            *string        `json:"image"`
    Headline         *string        `json:"headline"`
    Resume           *string        `json:"resume"`
    Role             string         `gorm:"default:user" json:"role"`
    GitHubUsername   *string        `json:"githubUsername"`
    LeetCodeUsername *string        `json:"leetcodeUsername"`
    LinkedInUsername *string        `json:"linkedinUsername"`
    Skills           pq.StringArray `gorm:"type:text[]" json:"skills"`
    CreatedAt        time.Time      `json:"createdAt"`
    UpdatedAt        time.Time      `json:"updatedAt"`
    
    // Relations
    Projects   []Project    `gorm:"foreignKey:UserId" json:"projects,omitempty"`
    Education  []Education  `gorm:"foreignKey:UserId" json:"education,omitempty"`
    Experience []Experience `gorm:"foreignKey:UserId" json:"experience,omitempty"`
}

type Project struct {
    Id              string    `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
    UserId          string    `gorm:"type:uuid;not null" json:"userId"`
    Name            string    `gorm:"not null" json:"name"`
    GitHubURL       *string   `json:"githubUrl"`
    PrimaryLanguage *string   `json:"primaryLanguage"`
    Description     *string   `json:"description"`
    Image           *string   `json:"image"`
    URL             *string   `json:"url"`
    CreatedAt       time.Time `json:"createdAt"`
    UpdatedAt       time.Time `json:"updatedAt"`
}

type Education struct {
    Id              string    `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
    UserId          string    `gorm:"type:uuid;not null" json:"userId"`
    UniversityName  string    `gorm:"not null" json:"universityName"`
    UniversityImage *string   `json:"universityImage"`
    StartYear       string    `gorm:"not null" json:"startYear"`
    GraduationYear  string    `gorm:"not null" json:"graduationYear"`
    Major           string    `gorm:"not null" json:"major"`
    Minor           *string   `json:"minor"`
    GPA             *string   `json:"gpa"`
    CreatedAt       time.Time `json:"createdAt"`
    UpdatedAt       time.Time `json:"updatedAt"`
}

type Experience struct {
    Id             string    `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
    UserId         string    `gorm:"type:uuid;not null" json:"userId"`
    Company        string    `gorm:"not null" json:"company"`
    CompanyImage   *string   `json:"companyImage"`
    Title          string    `gorm:"not null" json:"title"`
    StartMonth     string    `gorm:"not null" json:"startMonth"`
    StartYear      string    `gorm:"not null" json:"startYear"`
    EndMonth       *string   `json:"endMonth"`
    EndYear        *string   `json:"endYear"`
    IsCurrent      bool      `gorm:"default:false" json:"isCurrent"`
    Location       *string   `json:"location"`
    EmploymentType *string   `json:"employmentType"`
    Description    *string   `json:"description"`
    CreatedAt      time.Time `json:"createdAt"`
    UpdatedAt      time.Time `json:"updatedAt"`
}
```

---

## Frontend Development

### Route Structure

```
app/
├── (auth)/
│   ├── sign-in/page.tsx         # Sign in page
│   ├── sign-up/page.tsx         # Sign up page
│   └── auth/
│       ├── callback/route.ts    # OAuth callback
│       └── error/page.tsx       # Auth error page
├── (site)/
│   └── page.tsx                 # Landing page
├── u/
│   └── [username]/
│       ├── page.tsx             # Public profile (server component)
│       └── components/
│           ├── profile-header.tsx
│           ├── skills-section.tsx
│           ├── github-heatmap.tsx
│           ├── leetcode-stats.tsx
│           ├── projects-grid.tsx
│           ├── experience-list.tsx
│           └── education-list.tsx
├── settings/
│   ├── page.tsx                 # Settings page (protected)
│   ├── layout.tsx               # Settings layout with sidebar
│   └── tabs/
│       ├── profile.tsx
│       ├── skills.tsx
│       ├── projects.tsx
│       ├── education.tsx
│       └── experience.tsx
└── layout.tsx
```

### Profile Route: `/u/[username]`

The user profile is now accessed at `/u/{username}` instead of `/{username}`.

```typescript
// app/u/[username]/page.tsx
import { notFound } from 'next/navigation';
import ProfileHeader from './components/profile-header';
import SkillsSection from './components/skills-section';
import GitHubHeatmap from './components/github-heatmap';
import LeetCodeStats from './components/leetcode-stats';
import ProjectsGrid from './components/projects-grid';
import ExperienceList from './components/experience-list';
import EducationList from './components/education-list';

interface PageProps {
  params: Promise<{ username: string }>;
}

async function getProfile(username: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/${username}`,
    { next: { revalidate: 60 } } // Cache for 60 seconds
  );
  
  if (!res.ok) return null;
  return res.json();
}

export default async function ProfilePage({ params }: PageProps) {
  const { username } = await params;
  const profile = await getProfile(username);
  
  if (!profile) {
    notFound();
  }
  
  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Column - Profile Info */}
        <div className="lg:col-span-1">
          <ProfileHeader user={profile} />
        </div>
        
        {/* Right Column - Content */}
        <div className="lg:col-span-3 space-y-6">
          {profile.skills?.length > 0 && (
            <SkillsSection skills={profile.skills} />
          )}
          
          {profile.leetcodeUsername && (
            <LeetCodeStats username={profile.leetcodeUsername} />
          )}
          
          {profile.githubUsername && (
            <GitHubHeatmap username={profile.githubUsername} />
          )}
          
          {profile.projects?.length > 0 && (
            <ProjectsGrid projects={profile.projects} />
          )}
          
          {profile.experience?.length > 0 && (
            <ExperienceList experience={profile.experience} />
          )}
          
          {profile.education?.length > 0 && (
            <EducationList education={profile.education} />
          )}
        </div>
      </div>
    </div>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps) {
  const { username } = await params;
  const profile = await getProfile(username);
  
  if (!profile) {
    return { title: 'User Not Found' };
  }
  
  const name = [profile.firstName, profile.lastName].filter(Boolean).join(' ') || username;
  
  return {
    title: `${name} | Devboard`,
    description: profile.headline || `${name}'s developer portfolio on Devboard`,
  };
}
```

### API Client

```typescript
// lib/api.ts
import { createClient } from '@/lib/supabase/client';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function getAuthHeaders(): Promise<HeadersInit> {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (session?.access_token) {
    headers['Authorization'] = `Bearer ${session.access_token}`;
  }
  
  return headers;
}

export const api = {
  // Public endpoints
  async getProfile(username: string) {
    const res = await fetch(`${API_URL}/api/v1/users/${username}`);
    if (!res.ok) throw new ApiError(res.status, 'Failed to fetch profile');
    return res.json();
  },
  
  async getGitHubData(username: string) {
    const res = await fetch(`${API_URL}/api/v1/users/${username}/github`);
    if (!res.ok) throw new ApiError(res.status, 'Failed to fetch GitHub data');
    return res.json();
  },
  
  async getLeetCodeData(username: string) {
    const res = await fetch(`${API_URL}/api/v1/users/${username}/leetcode`);
    if (!res.ok) throw new ApiError(res.status, 'Failed to fetch LeetCode data');
    return res.json();
  },
  
  // Protected endpoints
  async getCurrentUser() {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/api/v1/users/me`, { headers });
    if (!res.ok) throw new ApiError(res.status, 'Failed to fetch current user');
    return res.json();
  },
  
  async updateProfile(data: UpdateProfileData) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/api/v1/users/me`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new ApiError(res.status, 'Failed to update profile');
    return res.json();
  },
  
  async updateSkills(skills: string[]) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/api/v1/users/me/skills`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ skills }),
    });
    if (!res.ok) throw new ApiError(res.status, 'Failed to update skills');
    return res.json();
  },
  
  // Projects CRUD
  async createProject(data: CreateProjectData) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/api/v1/users/me/projects`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new ApiError(res.status, 'Failed to create project');
    return res.json();
  },
  
  async updateProject(id: string, data: UpdateProjectData) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/api/v1/users/me/projects/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new ApiError(res.status, 'Failed to update project');
    return res.json();
  },
  
  async deleteProject(id: string) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/api/v1/users/me/projects/${id}`, {
      method: 'DELETE',
      headers,
    });
    if (!res.ok) throw new ApiError(res.status, 'Failed to delete project');
  },
  
  // Similar patterns for education and experience...
};
```

### TypeScript Types

```typescript
// types/index.ts

export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string | null;
  lastName: string | null;
  image: string | null;
  headline: string | null;
  resume: string | null;
  role: string;
  githubUsername: string | null;
  leetcodeUsername: string | null;
  linkedinUsername: string | null;
  skills: string[];
  createdAt: string;
  updatedAt: string;
}

export interface FullUser extends User {
  projects: Project[];
  education: Education[];
  experience: Experience[];
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  githubUrl: string | null;
  primaryLanguage: string | null;
  description: string | null;
  image: string | null;
  url: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Education {
  id: string;
  userId: string;
  universityName: string;
  universityImage: string | null;
  startYear: string;
  graduationYear: string;
  major: string;
  minor: string | null;
  gpa: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Experience {
  id: string;
  userId: string;
  company: string;
  companyImage: string | null;
  title: string;
  startMonth: string;
  startYear: string;
  endMonth: string | null;
  endYear: string | null;
  isCurrent: boolean;
  location: string | null;
  employmentType: string | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GitHubContributionData {
  totalContributions: number;
  weeks: {
    contributionDays: {
      contributionCount: number;
      date: string;
    }[];
  }[];
}

export interface LeetCodeStats {
  status: string;
  totalSolved: number;
  totalQuestions: number;
  easySolved: number;
  totalEasy: number;
  mediumSolved: number;
  totalMedium: number;
  hardSolved: number;
  totalHard: number;
  acceptanceRate: number;
  ranking: number;
  submissionCalendar: Record<string, number>;
}

// Form data types
export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  headline?: string;
  image?: string;
  resume?: string;
  githubUsername?: string;
  leetcodeUsername?: string;
  linkedinUsername?: string;
}

export interface CreateProjectData {
  name: string;
  githubUrl?: string;
  primaryLanguage?: string;
  description?: string;
  image?: string;
  url?: string;
}

export type UpdateProjectData = Partial<CreateProjectData>;
```

---

## User Profiles

### URL Structure Change

| Old Route | New Route |
|-----------|-----------|
| `/{username}` | `/u/{username}` |

This change:
- Avoids conflicts with other top-level routes
- Makes the URL structure clearer
- Simplifies routing logic (no need for banned username checks at route level)

### Profile Page Data Flow

```
1. User navigates to /u/johndoe
        │
        ▼
2. Server Component fetches profile from Go API
   GET /api/v1/users/johndoe
        │
        ▼
3. API returns user with relations:
   { id, username, skills, projects, education, experience, ... }
        │
        ▼
4. Page renders server-side with profile data
        │
        ▼
5. Client components hydrate and fetch external data:
   - GitHubHeatmap: GET /api/v1/users/johndoe/github
   - LeetCodeStats: GET /api/v1/users/johndoe/leetcode
```

### Profile Components

| Component | Data Source | Render Type |
|-----------|-------------|-------------|
| ProfileHeader | Initial fetch | Server |
| SkillsSection | Initial fetch | Server |
| ProjectsGrid | Initial fetch | Server |
| ExperienceList | Initial fetch | Server |
| EducationList | Initial fetch | Server |
| GitHubHeatmap | Lazy fetch | Client |
| LeetCodeStats | Lazy fetch | Client |

---

## External Integrations

### GitHub Contribution Data

The Go backend proxies GitHub GraphQL API requests:

```go
// services/github.go
package services

import (
    "bytes"
    "encoding/json"
    "net/http"
    "os"
)

type GitHubService struct {
    token string
}

func NewGitHubService() *GitHubService {
    return &GitHubService{
        token: os.Getenv("GITHUB_TOKEN"),
    }
}

const contributionQuery = `
query($userName: String!) {
    user(login: $userName) {
        contributionsCollection {
            contributionCalendar {
                totalContributions
                weeks {
                    contributionDays {
                        contributionCount
                        date
                    }
                }
            }
        }
    }
}
`

func (s *GitHubService) GetContributions(username string) (*ContributionData, error) {
    payload := map[string]interface{}{
        "query": contributionQuery,
        "variables": map[string]string{
            "userName": username,
        },
    }
    
    body, _ := json.Marshal(payload)
    req, _ := http.NewRequest("POST", "https://api.github.com/graphql", bytes.NewBuffer(body))
    req.Header.Set("Authorization", "Bearer "+s.token)
    req.Header.Set("Content-Type", "application/json")
    
    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        return nil, err
    }
    defer resp.Body.Close()
    
    var result GitHubResponse
    json.NewDecoder(resp.Body).Decode(&result)
    
    return &result.Data.User.ContributionsCollection.ContributionCalendar, nil
}
```

### LeetCode Statistics

```go
// services/leetcode.go
package services

import (
    "encoding/json"
    "fmt"
    "net/http"
)

const leetcodeAPI = "https://leetcode-stats-api.herokuapp.com"

type LeetCodeService struct{}

func NewLeetCodeService() *LeetCodeService {
    return &LeetCodeService{}
}

func (s *LeetCodeService) GetStats(username string) (*LeetCodeStats, error) {
    resp, err := http.Get(fmt.Sprintf("%s/%s", leetcodeAPI, username))
    if err != nil {
        return nil, err
    }
    defer resp.Body.Close()
    
    var stats LeetCodeStats
    if err := json.NewDecoder(resp.Body).Decode(&stats); err != nil {
        return nil, err
    }
    
    return &stats, nil
}
```

---

## API Endpoint Specification

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/api/v1/users/:username` | Get public profile with relations |
| GET | `/api/v1/users/:username/github` | Get GitHub contribution data |
| GET | `/api/v1/users/:username/leetcode` | Get LeetCode statistics |

### Protected Endpoints (Require Auth)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/users` | Create user profile (new signup) |
| GET | `/api/v1/users/me` | Get current user's profile |
| PUT | `/api/v1/users/me` | Update current user's profile |
| DELETE | `/api/v1/users/me` | Delete current user's account |
| PUT | `/api/v1/users/me/skills` | Update skills array |
| GET | `/api/v1/users/me/projects` | List user's projects |
| POST | `/api/v1/users/me/projects` | Create project |
| PUT | `/api/v1/users/me/projects/:id` | Update project |
| DELETE | `/api/v1/users/me/projects/:id` | Delete project |
| GET | `/api/v1/users/me/education` | List user's education |
| POST | `/api/v1/users/me/education` | Create education entry |
| PUT | `/api/v1/users/me/education/:id` | Update education entry |
| DELETE | `/api/v1/users/me/education/:id` | Delete education entry |
| GET | `/api/v1/users/me/experience` | List user's experience |
| POST | `/api/v1/users/me/experience` | Create experience entry |
| PUT | `/api/v1/users/me/experience/:id` | Update experience entry |
| DELETE | `/api/v1/users/me/experience/:id` | Delete experience entry |

### Request/Response Examples

**Create User (POST /api/v1/users)**
```json
// Request
{
  "username": "johndoe",
  "email": "john@example.com"
}

// Response
{
  "id": "uuid",
  "username": "johndoe",
  "email": "john@example.com",
  "role": "user",
  "skills": [],
  "createdAt": "2025-02-05T00:00:00Z",
  "updatedAt": "2025-02-05T00:00:00Z"
}
```

**Update Profile (PUT /api/v1/users/me)**
```json
// Request
{
  "firstName": "John",
  "lastName": "Doe",
  "headline": "Full Stack Developer",
  "githubUsername": "johndoe",
  "leetcodeUsername": "johndoe"
}

// Response
{
  "id": "uuid",
  "username": "johndoe",
  "firstName": "John",
  "lastName": "Doe",
  "headline": "Full Stack Developer",
  "githubUsername": "johndoe",
  "leetcodeUsername": "johndoe",
  ...
}
```

---

## Environment Configuration

### Root `.env` (Go API)

```bash
# Server
PORT=8080
GIN_MODE=debug  # debug | release

# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_JWT_SECRET=your-jwt-secret
SUPABASE_DB_URL=postgresql://postgres:password@db.xxx.supabase.co:5432/postgres

# External APIs
GITHUB_TOKEN=ghp_xxxx

# CORS
ALLOWED_ORIGINS=http://localhost:3000
```

### UI `.env` (`/ui/.env`)

```bash
NODE_ENV=development

# URLs
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8080

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJxxxx
```

---

## Development Workflow

### Starting Development

```bash
# Terminal 1: Start Go API
go run main.go

# Terminal 2: Start Next.js UI
cd ui && npm run dev
```

### Development Checklist

#### Phase 1: Core Infrastructure
- [ ] Set up Supabase project (auth + database)
- [ ] Run SQL migrations to create tables
- [ ] Complete Go API structure (router, middleware, db connection)
- [ ] Implement JWT verification middleware
- [ ] Add CORS middleware

#### Phase 2: User Management
- [ ] Implement user creation endpoint
- [ ] Implement profile fetch endpoints (by username, current user)
- [ ] Implement profile update endpoint
- [ ] Add username validation (uniqueness, banned words)
- [ ] Connect frontend auth flow to create profile on signup

#### Phase 3: Profile Data
- [ ] Implement skills update endpoint
- [ ] Implement projects CRUD endpoints
- [ ] Implement education CRUD endpoints
- [ ] Implement experience CRUD endpoints

#### Phase 4: External Integrations
- [ ] Implement GitHub proxy endpoint
- [ ] Implement LeetCode proxy endpoint
- [ ] Add caching for external API responses (optional)

#### Phase 5: Frontend
- [ ] Build profile page at `/u/[username]`
- [ ] Build settings page with tabs
- [ ] Implement all profile components
- [ ] Connect all forms to API endpoints

#### Phase 6: Polish
- [ ] Add loading states
- [ ] Add error handling
- [ ] Add form validation
- [ ] Optimize images and assets
- [ ] Add SEO metadata

---

## Key Differences from Deprecated App

| Aspect | Old (Deprecated) | New |
|--------|------------------|-----|
| Profile URL | `/{username}` | `/u/{username}` |
| Auth | Clerk | Supabase Auth |
| Database | MongoDB (Prisma) | Supabase Postgres (GORM) |
| API | Next.js API Routes | Go Gin API |
| User Sync | Clerk webhooks | Direct creation on signup |
| Education | Hardcoded university list | Flexible university name/image |
| File Uploads | UploadThing | TBD (Supabase Storage or other) |

---

## Summary

Devboard v2 maintains the same core functionality as the original:
- Developer portfolio profiles with skills, projects, education, and experience
- GitHub contribution heatmap integration
- LeetCode statistics integration
- Settings dashboard for profile management

Key architectural improvements:
- Decoupled frontend and backend for better scalability
- Go backend for performance and type safety
- Supabase for unified auth and database
- Cleaner URL structure with `/u/{username}`
- Flexible education/company entries (no hardcoded lists)
