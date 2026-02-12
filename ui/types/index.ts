// ============================================
// User types
// ============================================

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

export interface UserQueryParams {
  page?: string;
  limit?: string;
  search?: string;
  skill?: string;
  location?: string;
}

// ============================================
// Project types
// ============================================

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

export interface CreateProjectData {
  name: string;
  githubUrl?: string;
  primaryLanguage?: string;
  description?: string;
  image?: string;
  url?: string;
}

export type UpdateProjectData = Partial<CreateProjectData>;

// ============================================
// Education types
// ============================================

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

export interface CreateEducationData {
  universityName: string;
  universityImage?: string;
  startYear: string;
  graduationYear: string;
  major: string;
  minor?: string;
  gpa?: string;
}

export type UpdateEducationData = Partial<CreateEducationData>;

// ============================================
// Experience types
// ============================================

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

export interface CreateExperienceData {
  company: string;
  companyImage?: string;
  title: string;
  startMonth: string;
  startYear: string;
  endMonth?: string;
  endYear?: string;
  isCurrent?: boolean;
  location?: string;
  employmentType?: string;
  description?: string;
}

export type UpdateExperienceData = Partial<CreateExperienceData>;

// ============================================
// Follow types
// ============================================

export interface Follow {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: string;
  follower?: User;
  following?: User;
}

export interface FollowResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
}

export interface FollowStatusResponse {
  isFollowing: boolean;
}

// ============================================
// Profile update types
// ============================================

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

// ============================================
// External API types
// ============================================

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
