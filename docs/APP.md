# Devboard - Application Documentation

> "The Better Portfolio for Software Engineers"

Devboard is a developer portfolio platform built with Next.js that allows software engineers to create professional profile pages showcasing their skills, experience, education, projects, and coding activity from GitHub and LeetCode.

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Application Architecture](#application-architecture)
3. [User Authentication](#user-authentication)
4. [User Profiles](#user-profiles)
5. [Data Models](#data-models)
6. [External Data Integration](#external-data-integration)
7. [Settings & Profile Management](#settings--profile-management)
8. [API Routes](#api-routes)

---

## Tech Stack

- **Framework**: Next.js (App Router)
- **Authentication**: Clerk
- **Database**: MongoDB with Prisma ORM
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **File Uploads**: UploadThing
- **Form Handling**: React Hook Form + Zod validation
- **HTTP Client**: Axios
- **Theming**: next-themes (forced dark mode)

---

## Application Architecture

The application uses Next.js App Router with the following route structure:

```
app/
├── (auth)/              # Authentication routes (sign-in, sign-up)
├── (site)/              # Landing page
├── [username]/          # Dynamic user profile pages
├── settings/            # User settings/profile editor
├── community/           # Community page
├── api/                 # API routes
└── actions/             # Server actions
```

The app features a fixed sidebar navigation (`Sidebar.tsx`) with the main content area offset by 260px.

---

## User Authentication

Authentication is handled by **Clerk** with webhook integration for user synchronization.

### Clerk Webhook (`/api/clerk/route.ts`)

When a user is created or updated in Clerk, a webhook syncs the data to the MongoDB database:

- **`user.created`**: Creates a new user record in the database
- **`user.updated`**: Updates existing user data
- **`user.deleted`**: Removes the user from the database

### Banned Usernames

The system prevents registration of usernames that conflict with application routes:

```
settings, api, auth, sign-up, sign-in, dashboard, profile, admin, 
projects, experience, education, skills, about, contact, community, 
terms, privacy, help, support, blog, docs
```

---

## User Profiles

### Profile Page Structure (`/[username]`)

User profiles are accessible via dynamic routes (e.g., `/johndoe`). The profile page consists of two main sections:

#### Left Profile Column (25% width)
- Profile image
- Full name (first + last name)
- Username
- Headline/bio
- Edit Profile button (links to `/settings`)
- Connected accounts with links:
  - LinkedIn
  - GitHub
  - LeetCode

#### Right Profile Column (75% width)
- **Skills**: Displayed as icon images with tooltips
- **LeetCode Stats**: Doughnut chart showing solved problems by difficulty, plus activity calendar
- **GitHub Heatmap**: Contribution calendar visualization with total contribution count
- **Projects**: Grid of project cards with name, description, primary language, and links
- **Experience**: Timeline of work experience with company, title, dates, location, and description
- **Education**: List of educational institutions with major, minor, GPA, and date range

### Profile Data Flow

1. When a profile page loads, `UserProfile.tsx` fetches user data via `/api/user/fetch/username`
2. The API returns the full user object including related projects, education, and experience
3. If the user has connected GitHub/LeetCode usernames, those components fetch external data on mount

---

## Data Models

### User Model

```prisma
model User {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  clerkId   String   @unique
  email     String   @unique
  username  String   @unique
  firstName String?
  lastName  String?
  image     String?
  headline  String?
  resume    String?
  role      String   @default("user")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Connected external accounts
  gitHubUsername   String?
  leetCodeUsername String?
  linkedInUsername String?

  // Relations
  skills     String[]
  projects   Project[]
  education  Education[]
  experience Experience[]
}
```

### Project Model

```prisma
model Project {
  id              String   @id @default(auto()) @map("_id") @db.ObjectId
  userId          String   @db.ObjectId
  name            String
  gitHubUrl       String?
  primaryLanguage String?
  description     String?
  image           String?
  url             String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

### Education Model

```prisma
model Education {
  id             String   @id @default(auto()) @map("_id") @db.ObjectId
  userId         String   @db.ObjectId
  universityId   Int          # References hardcoded college list
  startYear      String
  graduationYear String
  major          String
  minor          String?
  gpa            String?
  image          String?
  createdAt      DateTime @default(now())
  updatedAt      DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

**Note**: The `universityId` references a hardcoded list of Sacramento-area colleges in `hooks/education.ts`. This includes:
- California State University, Sacramento
- University of California, Davis
- American River College
- Sacramento City College
- Folsom Lake College
- Cosumnes River College
- Sierra College
- William Jessup University

### Experience Model

```prisma
model Experience {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  userId      String   @db.ObjectId
  company     String
  title       String
  startMonth  String
  startYear   String
  endMonth    String?
  endYear     String?
  isCurrent   Boolean?
  location    String
  type        String       # e.g., "Full-time", "Internship", etc.
  description String?
  image       String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

---

## External Data Integration

### GitHub Contribution Data

**Endpoint**: `/api/user/fetch/github`  
**Action**: `getGitHubContributionData.ts`

When a profile with a connected GitHub username loads:

1. `GitHubHeatmap.tsx` component makes a POST request with the GitHub username
2. The server action queries GitHub's GraphQL API with the contribution calendar query
3. Returns weekly contribution data including:
   - `totalContributions`: Total number of contributions in the past year
   - `weeks[]`: Array of weeks containing daily contribution counts and dates

**GitHub GraphQL Query**:
```graphql
query($userName:String!) {
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
```

**Visualization**: The data is rendered as a GitHub-style contribution heatmap with color-coded cells representing activity levels.

### LeetCode Statistics

**Endpoint**: `/api/user/fetch/leetcode`  
**Action**: `getLeetCodeStats.ts`

When a profile with a connected LeetCode username loads:

1. `LeetCode.tsx` component makes a POST request with the LeetCode username
2. The server action queries `https://leetcode-stats-api.herokuapp.com/{username}/`
3. Returns comprehensive problem-solving statistics:
   - `totalSolved`: Total problems solved
   - `easySolved`, `mediumSolved`, `hardSolved`: Problems by difficulty
   - `totalEasy`, `totalMedium`, `totalHard`: Total available by difficulty
   - `acceptanceRate`: Submission acceptance rate
   - `ranking`: Global ranking
   - `submissionCalendar`: Daily submission activity

**Visualization**:
- Doughnut chart showing easy/medium/hard distribution
- Progress bars for each difficulty level
- Activity calendar showing submission history

---

## Settings & Profile Management

### Settings Page (`/settings`)

The settings page uses a tabbed interface via `SettingsSidebar` with five sections:

#### 1. Profile Tab
Editable fields:
- Profile image (via UploadThing)
- First name / Last name
- Headline
- Resume (PDF upload via UploadThing)
- GitHub username
- LeetCode username
- LinkedIn username

#### 2. Skills Tab
Users can select from predefined skill categories:

**Core Languages**: Java, Python, JavaScript, TypeScript, C, C++, C#, Go, PHP, Swift, Rust, Kotlin

**Frontend Skills**: HTML, CSS, React, Next.js, Angular, Svelte, Nuxt, Vite, Vue, jQuery, Tailwind, Bootstrap, MaterialUI

**Backend Skills**: Node, Express, GraphQL, MongoDB, MySQL, PostgreSQL, Firebase, Supabase

**Other Skills**: AWS, Google Cloud, Docker

Skills are stored as an array of strings and displayed as icons on the profile.

#### 3. Education Tab
CRUD operations for education entries:
- University selection (from Sacramento-area colleges)
- Start year / Graduation year
- Major / Minor
- GPA

#### 4. Experience Tab
CRUD operations for work experience:
- Company name
- Job title
- Start/End dates (month + year)
- Current position toggle
- Location
- Employment type
- Description

#### 5. Projects Tab
CRUD operations for projects:
- Project name
- Description
- Primary language
- GitHub URL
- Live URL
- Project image

---

## API Routes

### User Data Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/user` | POST | Update user profile |
| `/api/user/fetch/username` | POST | Get user by username (with relations) |
| `/api/user/fetch/clerkId` | POST | Get user by Clerk ID |
| `/api/user/fetch/github` | POST | Fetch GitHub contribution data |
| `/api/user/fetch/leetcode` | POST | Fetch LeetCode statistics |
| `/api/user/resume` | POST | Update/delete resume |
| `/api/user/skills` | POST | Update user skills |

### Education Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/education/create` | POST | Create education entry |
| `/api/education/update` | POST | Update education entry |
| `/api/education/delete` | POST | Delete education entry |

### Experience Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/experience/create` | POST | Create experience entry |
| `/api/experience/update` | POST | Update experience entry |
| `/api/experience/delete` | POST | Delete experience entry |

### Project Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/project/create` | POST | Create project entry |
| `/api/project/update` | POST | Update project entry |
| `/api/project/delete` | POST | Delete project entry |

### Other Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/clerk` | POST | Clerk webhook for user sync |
| `/api/uploadthing` | Various | File upload handling |

---

## Type Definitions

### FullUser Type

```typescript
type FullUser = {
  id: string;
  clerkId: string;
  email: string;
  username: string;
  firstName: string | null;
  lastName: string | null;
  image: string | null;
  headline: string | null;
  resume: string | null;
  role: string;
  createdAt: Date;
  updatedAt: Date;

  gitHubUsername: string | null;
  leetCodeUsername: string | null;
  linkedInUsername: string | null;

  skills: string[];
  projects: Project[];
  education: Education[];
  experience: Experience[];
};
```

### LeetCodeStatsResponse Type

```typescript
type LeetCodeStatsResponse = {
  status: string;
  message: string;
  totalSolved?: number;
  totalQuestions?: number;
  easySolved?: number;
  totalEasy?: number;
  mediumSolved?: number;
  totalMedium?: number;
  hardSolved?: number;
  totalHard?: number;
  acceptanceRate?: number;
  ranking?: number;
  contributionPoints?: number;
  reputation?: number;
  submissionCalendar?: Record<string, number>;
};
```

---

## Summary

Devboard is a full-featured developer portfolio platform that:

1. **Authenticates users** via Clerk with automatic database synchronization
2. **Stores user metadata** in MongoDB including personal info, skills, projects, education, and experience
3. **Fetches external coding activity** from GitHub (contribution heatmap) and LeetCode (problem-solving stats) whenever a profile is loaded
4. **Provides a settings dashboard** for users to manage all aspects of their profile
5. **Displays public profiles** at username-based URLs with a comprehensive view of the developer's background
