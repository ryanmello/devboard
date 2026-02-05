# 🚀 Devboard - Developer Portfolio Platform

Devboard is a modern, full-stack web application that empowers developers to create comprehensive professional portfolios, showcase their coding achievements, and connect with other developers in the community. Built with cutting-edge technologies, Devboard seamlessly integrates with popular developer platforms like GitHub and LeetCode to automatically display your coding activity and accomplishments.

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Technical Highlights](#technical-highlights)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Environment Setup](#environment-setup)
- [Database Schema](#database-schema)
- [API Routes](#api-routes)
- [Project Structure](#project-structure)
- [Future Enhancements](#future-enhancements)

## 🎯 Overview

**Purpose:** Devboard solves a common problem for developers - creating and maintaining a professional online presence. Instead of manually updating multiple platforms, developers can use Devboard to:

- Centralize all professional information in one place
- Automatically showcase GitHub contributions with visual heatmaps
- Display LeetCode problem-solving statistics and activity
- Share projects, experience, and education in a beautiful, organized layout
- Make their profile easily shareable with a custom username URL
- Discover and connect with other developers

**Target Users:** Software developers, computer science students, and tech professionals looking to enhance their online presence for recruiting, networking, or personal branding.

## ✨ Key Features

### 🔐 Authentication & User Management
- Secure authentication powered by **Clerk**
- Custom username profiles (`yoursite.com/username`)
- OAuth integration for seamless sign-up/sign-in
- Protected routes and user-specific data management

### 👤 Dynamic User Profiles
- **Left Panel:** 
  - Profile picture and basic information
  - Contact details and social links
  - Technical skills organized by category (Frontend, Backend, Core, Other)
  - Resume upload and download functionality
  
- **Right Panel:**
  - GitHub contribution heatmap with real-time data
  - LeetCode statistics (problems solved, acceptance rate, rankings)
  - Project showcase with descriptions, images, and links
  - Work experience timeline
  - Education history

### 📊 Platform Integrations

#### GitHub Integration
- Real-time contribution heatmap visualization
- Displays commit activity over the past year
- Color-coded cells showing contribution intensity
- Automatic data synchronization

#### LeetCode Integration
- Total problems solved breakdown (Easy/Medium/Hard)
- Acceptance rate and submission statistics
- Visual progress bars and charts
- Problem-solving streaks and activity

### ⚙️ Comprehensive Settings Dashboard
Organized into intuitive tabs:

1. **Profile Tab**
   - Update personal information
   - Change profile picture
   - Set headline/bio
   - Configure social media links (GitHub, LeetCode, LinkedIn)

2. **Skills Tab**
   - Add/remove technical skills
   - Categorize skills (Frontend: React, Vue | Backend: Node.js, Python | etc.)
   - Visual skill preview
   - Drag-and-drop organization

3. **Projects Tab**
   - Add project details (name, description, tech stack)
   - Upload project images
   - Link to GitHub repositories and live demos
   - Edit or delete existing projects

4. **Experience Tab**
   - Add work experience entries
   - Specify company, role, duration, and location
   - Mark current positions
   - Add detailed descriptions
   - Upload company logos

5. **Education Tab**
   - Add university/college information
   - Specify degree, major, minor, and GPA
   - Set graduation year
   - Upload institution logos

### 🌐 Community Discovery
- Browse all registered developers
- Filter and search through profiles
- Quick access to other developers' portfolios
- Networking opportunities

### 📱 Responsive Design
- Fully responsive across all device sizes
- Modern, clean UI with smooth animations
- Dark mode support (system preference or manual toggle)
- Accessible components following WCAG guidelines

## 💡 Technical Highlights

### For Recruiters & Technical Evaluators

This project demonstrates proficiency in:

1. **Full-Stack Development**
   - RESTful API design with Next.js API routes
   - Server-side rendering (SSR) and client-side rendering (CSR)
   - Database design and management with Prisma ORM
   - Third-party API integration (GitHub, LeetCode)

2. **Modern React Patterns**
   - React Server Components
   - Custom hooks for reusable logic
   - Form management with react-hook-form
   - State management with React Context and hooks

3. **Type Safety**
   - Full TypeScript implementation
   - Type-safe database queries with Prisma
   - Zod schema validation
   - Custom type definitions

4. **Security & Authentication**
   - Secure authentication with Clerk
   - Protected API routes
   - Server-side session management
   - Role-based access control

5. **Database & Backend**
   - MongoDB with Prisma ORM
   - Efficient database queries and relations
   - Data validation and sanitization
   - Webhook integration for real-time updates

6. **UI/UX Excellence**
   - Component-based architecture with Radix UI primitives
   - Consistent design system with Tailwind CSS
   - Smooth animations and transitions
   - Responsive layouts with mobile-first approach

7. **File Management**
   - Secure file uploads with UploadThing
   - Resume and image storage
   - Optimized image handling

## 🛠 Technology Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS, CSS Modules
- **UI Components:** Radix UI, shadcn/ui
- **Forms:** React Hook Form + Zod validation
- **Charts:** Recharts, React-ChartJS-2
- **Icons:** Lucide React, React Icons

### Backend
- **Runtime:** Node.js
- **API:** Next.js API Routes (RESTful)
- **Database:** MongoDB
- **ORM:** Prisma
- **Authentication:** Clerk
- **File Upload:** UploadThing

### DevOps & Tools
- **Version Control:** Git
- **Package Manager:** npm
- **Linting:** ESLint
- **Deployment:** Vercel-ready
- **Webhooks:** Svix for Clerk webhooks

## 🏗 Architecture

### Application Structure
```
Devboard follows Next.js 14 App Router architecture:

- /app
  - /(auth)          → Authentication pages (sign-in, sign-up)
  - /(site)          → Public landing page
  - /[username]      → Dynamic user profile pages
  - /settings        → User settings dashboard
  - /community       → Developer discovery
  - /api             → REST API endpoints

- /components        → Reusable UI components
- /lib               → Utility functions and database client
- /hooks             → Custom React hooks
- /types             → TypeScript type definitions
- /prisma            → Database schema and migrations
- /utils             → Helper functions
```

### Data Flow
1. **User Authentication:** Clerk handles authentication and syncs with database via webhooks
2. **Profile Creation:** Users create/update profiles through settings dashboard
3. **External Data:** GitHub and LeetCode data fetched via server-side API calls
4. **Database Operations:** Prisma handles all database queries with type safety
5. **File Uploads:** UploadThing manages resume and image uploads to cloud storage
6. **Profile Display:** Dynamic routes render user profiles with SSR for SEO

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- MongoDB database (local or Atlas)
- Clerk account for authentication
- UploadThing account for file uploads

## 🗄 Database Schema

The application uses MongoDB with Prisma ORM. Key models include:

- **User:** Core user information, social links, and skills
- **Project:** User projects with descriptions, images, and links
- **Experience:** Work experience entries with company details
- **Education:** Academic history with institution information

All models use Prisma's relationship management for efficient queries and data integrity.

## 📁 Project Structure

```
devboard/
├── app/                          # Next.js app directory
│   ├── (auth)/                  # Authentication routes
│   ├── (site)/                  # Landing page
│   ├── [username]/              # Dynamic user profiles
│   │   ├── components/          # Profile-specific components
│   │   │   ├── github/         # GitHub integration components
│   │   │   └── leetcode/       # LeetCode integration components
│   │   └── page.tsx
│   ├── actions/                 # Server actions
│   ├── api/                     # API routes
│   ├── community/               # Community page
│   ├── settings/                # Settings dashboard
│   │   ├── components/         # Settings components
│   │   └── tabs/               # Settings tabs
│   ├── globals.css
│   └── layout.tsx
├── components/                   # Shared components
│   ├── ui/                      # UI component library
│   └── ...
├── hooks/                       # Custom React hooks
├── lib/                         # Utility libraries
├── prisma/                      # Database schema
├── types/                       # TypeScript types
├── utils/                       # Helper functions
└── public/                      # Static assets
```

## 🔮 Future Enhancements

Potential features for future development:

- **Real-time Messaging:** Direct messaging between developers
- **Job Board Integration:** Post and apply for jobs within the platform
- **Blog/Articles:** Allow developers to write and share technical articles
- **Achievement System:** Gamification with badges and milestones
- **Advanced Analytics:** Detailed insights into profile views and engagement
- **Team Profiles:** Support for company/team showcases
- **API for Developers:** Public API for accessing profile data
- **More Integrations:** Stack Overflow, CodePen, DevPost, etc.
- **Export Options:** Generate PDF resumes from profile data
- **Interview Prep:** Integrated coding challenges and interview questions
