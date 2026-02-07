# Devboard Frontend Development Guide

> The definitive source of truth for building the Next.js frontend that connects to the Go backend.

This document outlines all frontend requirements, components, pages, and integration points. **The UI must be polished, modern, and provide an excellent user experience.**

---

## Table of Contents

1. [Design Principles](#design-principles)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Pages Overview](#pages-overview)
5. [Landing Page](#landing-page)
6. [Authentication](#authentication)
7. [Profile Page](#profile-page)
8. [Community Page](#community-page)
9. [Settings Page](#settings-page)
10. [Components](#components)
11. [API Integration](#api-integration)
12. [Styling & UI Requirements](#styling--ui-requirements)

---

## Design Principles

### UI/UX Requirements

**The frontend MUST have a polished, professional, and modern UI.** Follow these principles:

1. **Clean & Minimal** - Use whitespace effectively, avoid clutter
2. **Consistent** - Use shadcn/ui components throughout for a unified look
3. **Responsive** - Mobile-first design, works on all screen sizes
4. **Accessible** - Proper ARIA labels, keyboard navigation, color contrast
5. **Fast** - Optimize loading states, skeleton loaders, lazy loading
6. **Delightful** - Subtle animations, micro-interactions, smooth transitions

### Visual Guidelines

- Modern color palette with good contrast
- Clean typography with proper hierarchy
- Rounded corners on cards and buttons
- Subtle shadows for depth
- Consistent spacing (use Tailwind's spacing scale)
- Dark mode support (optional but recommended)
- **NO gradients** - use solid colors only throughout the entire UI

---

## Technology Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI Components | **shadcn/ui** (required) |
| Auth | Supabase Auth (@supabase/ssr) |
| HTTP Client | Native fetch with wrapper |
| Forms | React Hook Form + Zod |
| State | React hooks / Context |
| Icons | Lucide React |

### Required shadcn/ui Components

Install these core components:

```bash
npx shadcn@latest init
npx shadcn@latest add button card input label textarea select avatar badge separator tabs form dialog dropdown-menu navigation-menu sheet skeleton toast sonner
```

---

## Project Structure

```
ui/
├── app/
│   ├── (auth)/
│   │   ├── sign-in/page.tsx        # Sign in page
│   │   ├── sign-up/page.tsx        # Sign up page
│   │   └── auth/
│   │       ├── callback/route.ts   # OAuth callback handler
│   │       └── error/page.tsx      # Auth error page
│   ├── (site)/
│   │   ├── page.tsx                # Landing page (public)
│   │   └── layout.tsx              # Site layout with navbar
│   ├── u/
│   │   └── [username]/
│   │       └── page.tsx            # Public profile page
│   ├── community/
│   │   └── page.tsx                # Community directory
│   ├── settings/
│   │   ├── page.tsx                # Settings dashboard
│   │   └── layout.tsx              # Settings layout with sidebar
│   ├── layout.tsx                  # Root layout
│   └── globals.css                 # Global styles
├── components/
│   ├── ui/                         # shadcn/ui components
│   ├── landing/                    # Landing page components
│   │   ├── hero.tsx
│   │   ├── features.tsx
│   │   ├── benefits.tsx
│   │   ├── cta.tsx
│   │   └── footer.tsx
│   ├── profile/                    # Profile display components
│   │   ├── profile-header.tsx
│   │   ├── skills-section.tsx
│   │   ├── github-heatmap.tsx
│   │   ├── leetcode-stats.tsx
│   │   ├── projects-grid.tsx
│   │   ├── experience-list.tsx
│   │   └── education-list.tsx
│   ├── community/                  # Community components
│   │   ├── user-card.tsx
│   │   ├── user-grid.tsx
│   │   └── search-filters.tsx
│   ├── settings/                   # Settings form components
│   │   ├── profile-form.tsx
│   │   ├── skills-form.tsx
│   │   ├── projects-form.tsx
│   │   ├── education-form.tsx
│   │   └── experience-form.tsx
│   └── shared/                     # Shared components
│       ├── navbar.tsx
│       ├── user-nav.tsx
│       ├── mobile-nav.tsx
│       └── page-header.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts               # Browser Supabase client
│   │   └── server.ts               # Server Supabase client
│   ├── api.ts                      # Go API client
│   └── utils.ts                    # Utility functions
├── hooks/
│   ├── use-auth.ts                 # Auth state hook
│   └── use-profile.ts              # Profile data hook
└── types/
    └── index.ts                    # TypeScript types
```

---

## Pages Overview

| Route | Page | Auth Required | Description |
|-------|------|---------------|-------------|
| `/` | Landing | No | Marketing page explaining the app |
| `/sign-in` | Sign In | No | User authentication |
| `/sign-up` | Sign Up | No | New user registration |
| `/u/[username]` | Profile | No | Public user profile |
| `/community` | Community | No | Browse all users |
| `/settings` | Settings | Yes | Edit own profile |

---

## Landing Page

**Route:** `/` (app/(site)/page.tsx)

The landing page is the first impression. It must be **visually stunning** and clearly communicate value.

### Required Sections

#### 1. Hero Section
- Large, attention-grabbing headline
- Subheadline explaining what Devboard is
- Primary CTA: "Get Started" or "Create Your Profile"
- Secondary CTA: "View Demo Profile"
- Optional: Hero image or illustration

```tsx
// Example content
<Hero>
  <h1>Your Developer Portfolio, Simplified</h1>
  <p>Showcase your skills, projects, and coding journey in one beautiful profile.</p>
  <Button>Create Your Profile</Button>
  <Button variant="outline">View Demo</Button>
</Hero>
```

#### 2. Features Section
Highlight what users can do:

| Feature | Description |
|---------|-------------|
| GitHub Integration | Display your contribution heatmap and activity |
| LeetCode Stats | Show your problem-solving progress |
| Project Showcase | Highlight your best work with images and links |
| Experience & Education | Professional timeline of your journey |
| Skills Display | Visual representation of your tech stack |
| Custom Profile URL | Get your own `/u/username` link to share |

#### 3. Benefits Section
Why users should choose Devboard:

- **Stand Out** - More than just a resume, show your real work
- **All-in-One** - GitHub, LeetCode, projects, experience in one place
- **Easy to Share** - One link for recruiters, networking, and socials
- **Always Updated** - GitHub and LeetCode data syncs automatically
- **Professional Look** - Beautiful, modern design without effort

#### 4. How It Works Section
Simple 3-step process:

1. **Sign Up** - Create your account with GitHub or Google
2. **Build Your Profile** - Add your projects, experience, and connect integrations
3. **Share** - Get your unique profile URL to share anywhere

#### 5. Call-to-Action Section
Final push to convert visitors:

```tsx
<CTA>
  <h2>Ready to showcase your work?</h2>
  <p>Join developers who are standing out with Devboard.</p>
  <Button size="lg">Create Your Free Profile</Button>
</CTA>
```

#### 6. Footer
- Links: About, Privacy, Terms, Contact
- Social links
- Copyright

### Landing Page UI Requirements

- Use solid colors and subtle patterns for visual interest (NO gradients)
- Include testimonials or user count if available
- Add subtle animations on scroll (fade-in, slide-up)
- Ensure all CTAs link to `/sign-up`
- Mobile-responsive with stacked layout on small screens

---

## Authentication

### Sign Up Page

**Route:** `/sign-up`

Requirements:
- OAuth buttons for GitHub and Google (primary methods)
- Email/password option (optional)
- Link to sign in for existing users
- Clean, centered card layout
- Show loading states during auth

```tsx
// UI Structure
<Card className="w-full max-w-md mx-auto">
  <CardHeader>
    <CardTitle>Create your account</CardTitle>
    <CardDescription>Get started with Devboard</CardDescription>
  </CardHeader>
  <CardContent>
    <Button variant="outline" className="w-full">
      <GitHubIcon /> Continue with GitHub
    </Button>
    <Button variant="outline" className="w-full">
      <GoogleIcon /> Continue with Google
    </Button>
    <Separator />
    <p>Already have an account? <Link href="/sign-in">Sign in</Link></p>
  </CardContent>
</Card>
```

### Sign In Page

**Route:** `/sign-in`

Requirements:
- Same OAuth options as sign up
- Link to sign up for new users
- Consistent styling with sign up page

### Auth Callback

**Route:** `/auth/callback`

Handle the OAuth redirect:
1. Exchange code for session
2. Check if user profile exists in database
3. If new user, redirect to `/settings` for onboarding
4. If existing user, redirect to their profile or dashboard

### New User Flow

When a user signs up for the first time:
1. Supabase creates auth record
2. Frontend calls `POST /api/v1/users` to create profile
3. User is prompted to choose a username
4. User is redirected to `/settings` to complete profile

---

## Profile Page

**Route:** `/u/[username]`

The profile page displays all user information in a beautiful, organized layout.

### Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│                         Navbar                               │
├─────────────────┬───────────────────────────────────────────┤
│                 │                                            │
│  Profile Card   │  Skills Section                           │
│  - Avatar       │  - Skill badges                           │
│  - Name         ├───────────────────────────────────────────┤
│  - Headline     │  LeetCode Stats                           │
│  - Location     │  - Problem counts by difficulty           │
│  - Links        │  - Acceptance rate                        │
│                 ├───────────────────────────────────────────┤
│                 │  GitHub Heatmap                           │
│                 │  - Contribution calendar                  │
│                 │  - Total contributions                    │
│                 ├───────────────────────────────────────────┤
│                 │  Projects Grid                            │
│                 │  - Project cards with images              │
│                 ├───────────────────────────────────────────┤
│                 │  Experience Timeline                      │
│                 │  - Work history                           │
│                 ├───────────────────────────────────────────┤
│                 │  Education                                │
│                 │  - School/University entries              │
└─────────────────┴───────────────────────────────────────────┘
```

### Profile Components

#### ProfileHeader
- Large avatar image
- Full name (firstName + lastName)
- Username
- Headline/bio
- Social links (GitHub, LinkedIn, LeetCode)
- Resume download button (if available)

#### SkillsSection
- Grid or flex layout of skill badges
- Use shadcn Badge component
- Color-coded by category (optional)

#### GitHubHeatmap
- Contribution calendar visualization
- Total contributions count
- Streak information (optional)
- Uses data from `/api/v1/users/:username/github`

#### LeetCodeStats
- Problems solved by difficulty (Easy/Medium/Hard)
- Progress bars or circular progress
- Acceptance rate
- Ranking
- Uses data from `/api/v1/users/:username/leetcode`

#### ProjectsGrid
- Grid of project cards
- Each card shows:
  - Project image (or placeholder)
  - Project name
  - Description
  - Primary language badge
  - Links to GitHub repo and live site

#### ExperienceList
- Timeline-style layout
- Each entry shows:
  - Company logo
  - Job title
  - Company name
  - Date range
  - Employment type
  - Location
  - Description

#### EducationList
- Similar timeline layout
- Each entry shows:
  - University logo
  - University name
  - Degree/Major
  - Minor (if applicable)
  - Graduation year
  - GPA (if provided)

### Profile Page UI Requirements

- Use skeleton loaders while data is fetching
- Gracefully hide sections with no data
- Lazy load GitHub and LeetCode data
- Responsive: stack columns on mobile
- SEO metadata with user name and headline

---

## Community Page

**Route:** `/community`

A directory of all users who have created profiles on Devboard.

### Features

1. **User Grid** - Display user cards in a responsive grid
2. **Search** - Search by name, username, or skills
3. **Filters** - Filter by skills, location, or other criteria
4. **Pagination** - Handle large numbers of users

### User Card Component

Each user card displays:
- Avatar
- Name
- Username
- Headline
- Skills (top 3-5)
- Link to full profile

```tsx
<Card className="hover:shadow-md transition-shadow">
  <CardContent className="pt-6">
    <Avatar className="w-16 h-16 mx-auto" />
    <h3 className="text-lg font-semibold mt-4">{user.firstName} {user.lastName}</h3>
    <p className="text-muted-foreground">@{user.username}</p>
    <p className="text-sm mt-2">{user.headline}</p>
    <div className="flex gap-1 mt-3 flex-wrap justify-center">
      {user.skills.slice(0, 4).map(skill => (
        <Badge key={skill} variant="secondary">{skill}</Badge>
      ))}
    </div>
  </CardContent>
  <CardFooter>
    <Button asChild className="w-full">
      <Link href={`/u/${user.username}`}>View Profile</Link>
    </Button>
  </CardFooter>
</Card>
```

### API Endpoint Needed

The backend needs an endpoint to fetch all users:

```
GET /api/v1/users
Query params: ?page=1&limit=20&search=john&skill=react
```

### Community Page UI Requirements

- Clean grid layout (4 columns on desktop, 2 on tablet, 1 on mobile)
- Search bar at the top
- Filter sidebar or dropdown
- Empty state when no results
- Loading skeletons while fetching

---

## Settings Page

**Route:** `/settings`

Protected page for users to edit their profile.

### Layout

Sidebar navigation with tabs for different sections:

```
┌─────────────┬──────────────────────────────────────────┐
│ Sidebar     │ Content Area                             │
│             │                                          │
│ • Profile   │ [Active Tab Content]                    │
│ • Skills    │                                          │
│ • Projects  │                                          │
│ • Education │                                          │
│ • Experience│                                          │
│             │                                          │
└─────────────┴──────────────────────────────────────────┘
```

### Settings Tabs

#### Profile Tab
Edit basic profile information:
- First name, Last name
- Username (with availability check)
- Headline/bio
- Profile image URL
- Resume URL
- GitHub username
- LeetCode username
- LinkedIn username

#### Skills Tab
- Add/remove skills
- Skill input with autocomplete suggestions
- Drag to reorder (optional)
- Common skills quick-add

#### Projects Tab
- List of existing projects with edit/delete
- Add new project form:
  - Name (required)
  - Description
  - GitHub URL
  - Live URL
  - Primary language
  - Image URL

#### Education Tab
- List of education entries with edit/delete
- Add new education form:
  - University name
  - University image URL
  - Major
  - Minor
  - Start year
  - Graduation year
  - GPA

#### Experience Tab
- List of experience entries with edit/delete
- Add new experience form:
  - Company name
  - Company image URL
  - Job title
  - Employment type
  - Start month/year
  - End month/year (or current)
  - Location
  - Description

### Settings UI Requirements

- Use React Hook Form + Zod for validation
- Show success/error toasts on save
- Auto-save or explicit save button
- Confirm before deleting items
- Loading states during API calls
- Form validation with inline errors

---

## Components

### Navbar

Present on all pages, responsive design:

**Logged Out:**
- Logo (links to landing)
- Community link
- Sign In button
- Sign Up button (primary)

**Logged In:**
- Logo (links to landing or profile)
- Community link
- User dropdown:
  - My Profile
  - Settings
  - Sign Out

### Mobile Navigation

- Hamburger menu on mobile
- Sheet/drawer with navigation links
- User avatar and dropdown in drawer

---

## API Integration

### API Client (`lib/api.ts`)

Centralized API client that handles authentication:

```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
  getProfile: (username: string) => fetch(`${API_URL}/api/v1/users/${username}`),
  getUsers: (params?: UserQueryParams) => fetch(`${API_URL}/api/v1/users?${new URLSearchParams(params)}`),
  getGitHubData: (username: string) => fetch(`${API_URL}/api/v1/users/${username}/github`),
  getLeetCodeData: (username: string) => fetch(`${API_URL}/api/v1/users/${username}/leetcode`),
  
  // Protected endpoints (use getAuthHeaders)
  getCurrentUser: () => /* ... */,
  updateProfile: (data) => /* ... */,
  updateSkills: (skills) => /* ... */,
  createProject: (data) => /* ... */,
  updateProject: (id, data) => /* ... */,
  deleteProject: (id) => /* ... */,
  // ... education and experience CRUD
};
```

### API Endpoints Reference

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/users` | List all users (community) | No |
| GET | `/api/v1/users/:username` | Get public profile | No |
| GET | `/api/v1/users/:username/github` | Get GitHub data | No |
| GET | `/api/v1/users/:username/leetcode` | Get LeetCode data | No |
| GET | `/api/v1/users/me` | Get current user | Yes |
| PUT | `/api/v1/users/me` | Update profile | Yes |
| PUT | `/api/v1/users/me/skills` | Update skills | Yes |
| POST | `/api/v1/users/me/projects` | Create project | Yes |
| PUT | `/api/v1/users/me/projects/:id` | Update project | Yes |
| DELETE | `/api/v1/users/me/projects/:id` | Delete project | Yes |
| POST | `/api/v1/users/me/education` | Create education | Yes |
| PUT | `/api/v1/users/me/education/:id` | Update education | Yes |
| DELETE | `/api/v1/users/me/education/:id` | Delete education | Yes |
| POST | `/api/v1/users/me/experience` | Create experience | Yes |
| PUT | `/api/v1/users/me/experience/:id` | Update experience | Yes |
| DELETE | `/api/v1/users/me/experience/:id` | Delete experience | Yes |

---

### Typography

- Headings: Bold, clear hierarchy (h1 > h2 > h3)
- Body: Readable, good line-height
- Use Inter or similar modern font

### Component Styling Guidelines

1. **Cards**: Use shadcn Card with subtle shadows
2. **Buttons**: Primary for main actions, outline for secondary
3. **Forms**: Clear labels, helpful placeholders, error states
4. **Badges**: For skills, tags, status indicators
5. **Avatars**: Rounded, fallback to initials
6. **Skeletons**: Show while loading data

### Responsive Breakpoints

Follow Tailwind defaults:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

### Animation Guidelines

- Use subtle transitions (150-300ms)
- Fade in content as it loads
- Hover effects on interactive elements
- Avoid excessive or distracting animations

### Important Style Rules

- **NO GRADIENTS** - Do not use gradient backgrounds, text, or borders anywhere
- Use solid background colors for all sections, cards, and components
- Achieve visual hierarchy through spacing, shadows, and typography instead

---

## Development Checklist

### Phase 1: Setup
- [ ] Initialize Next.js project with TypeScript
- [ ] Install and configure Tailwind CSS
- [ ] Install shadcn/ui and required components
- [ ] Set up Supabase client (browser + server)
- [ ] Create API client with auth handling
- [ ] Define TypeScript types

### Phase 2: Authentication
- [ ] Build sign-in page
- [ ] Build sign-up page
- [ ] Implement OAuth callback handler
- [ ] Create auth context/hook
- [ ] Handle new user profile creation
- [ ] Protected route middleware

### Phase 3: Landing Page
- [ ] Hero section with CTAs
- [ ] Features section
- [ ] Benefits section
- [ ] How it works section
- [ ] Final CTA section
- [ ] Footer
- [ ] Mobile responsiveness

### Phase 4: Profile Page
- [ ] Profile header component
- [ ] Skills section
- [ ] GitHub heatmap integration
- [ ] LeetCode stats integration
- [ ] Projects grid
- [ ] Experience timeline
- [ ] Education list
- [ ] SEO metadata

### Phase 5: Community Page
- [ ] User grid layout
- [ ] User card component
- [ ] Search functionality
- [ ] Pagination
- [ ] Empty states
- [ ] Loading states

### Phase 6: Settings Page
- [ ] Settings layout with sidebar
- [ ] Profile edit form
- [ ] Skills management
- [ ] Projects CRUD
- [ ] Education CRUD
- [ ] Experience CRUD
- [ ] Form validation
- [ ] Toast notifications

### Phase 7: Polish
- [ ] Loading skeletons everywhere
- [ ] Error handling and error pages
- [ ] 404 page
- [ ] Mobile navigation
- [ ] Dark mode (optional)
- [ ] Performance optimization
- [ ] Final UI review

---

## Summary

This frontend should be a **showcase-quality application** that developers are proud to share. Every component should be polished, every interaction should be smooth, and every page should be thoughtfully designed.

Key requirements:
1. **shadcn/ui** for all components
2. **Modern, clean UI** throughout
3. **Full authentication** with sign in/sign up
4. **Compelling landing page** that converts
5. **Beautiful profile pages** with all data sections
6. **Community directory** to discover other developers
7. **Comprehensive settings** for profile management
8. **Responsive design** for all devices
