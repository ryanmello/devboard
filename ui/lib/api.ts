import { createClient } from "@/lib/supabase/client";
import type {
  User,
  FullUser,
  Project,
  Education,
  Experience,
  UpdateProfileData,
  CreateProjectData,
  UpdateProjectData,
  CreateEducationData,
  UpdateEducationData,
  CreateExperienceData,
  UpdateExperienceData,
  GitHubContributionData,
  LeetCodeStats,
} from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

async function getAuthHeaders(): Promise<HeadersInit> {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (session?.access_token) {
    headers["Authorization"] = `Bearer ${session.access_token}`;
  }

  return headers;
}

export const api = {
  // public endpoints
  async getProfile(username: string): Promise<FullUser> {
    const res = await fetch(`${API_URL}/api/v1/users/${username}`);
    if (!res.ok) throw new ApiError(res.status, "Failed to fetch profile");
    return res.json();
  },

  async getGitHubData(username: string): Promise<GitHubContributionData> {
    const res = await fetch(`${API_URL}/api/v1/users/${username}/github`);
    if (!res.ok) throw new ApiError(res.status, "Failed to fetch GitHub data");
    return res.json();
  },

  async getLeetCodeData(username: string): Promise<LeetCodeStats> {
    const res = await fetch(`${API_URL}/api/v1/users/${username}/leetcode`);
    if (!res.ok)
      throw new ApiError(res.status, "Failed to fetch LeetCode data");
    return res.json();
  },

  // protected endpoints
  async createUser(data: {
    username: string;
    email: string;
  }): Promise<User> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/api/v1/users`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new ApiError(res.status, "Failed to create user");
    return res.json();
  },

  async getCurrentUser(): Promise<FullUser> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/api/v1/users/me`, { headers });
    if (!res.ok)
      throw new ApiError(res.status, "Failed to fetch current user");
    return res.json();
  },

  async updateProfile(data: UpdateProfileData): Promise<User> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/api/v1/users/me`, {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new ApiError(res.status, "Failed to update profile");
    return res.json();
  },

  async deleteCurrentUser(): Promise<void> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/api/v1/users/me`, {
      method: "DELETE",
      headers,
    });
    if (!res.ok) throw new ApiError(res.status, "Failed to delete user");
  },

  async updateSkills(skills: string[]): Promise<User> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/api/v1/users/me/skills`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ skills }),
    });
    if (!res.ok) throw new ApiError(res.status, "Failed to update skills");
    return res.json();
  },

  async getMyProjects(): Promise<Project[]> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/api/v1/users/me/projects`, { headers });
    if (!res.ok) throw new ApiError(res.status, "Failed to fetch projects");
    return res.json();
  },

  async createProject(data: CreateProjectData): Promise<Project> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/api/v1/users/me/projects`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new ApiError(res.status, "Failed to create project");
    return res.json();
  },

  async updateProject(id: string, data: UpdateProjectData): Promise<Project> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/api/v1/users/me/projects/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new ApiError(res.status, "Failed to update project");
    return res.json();
  },

  async deleteProject(id: string): Promise<void> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/api/v1/users/me/projects/${id}`, {
      method: "DELETE",
      headers,
    });
    if (!res.ok) throw new ApiError(res.status, "Failed to delete project");
  },

  async getMyEducation(): Promise<Education[]> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/api/v1/users/me/education`, {
      headers,
    });
    if (!res.ok) throw new ApiError(res.status, "Failed to fetch education");
    return res.json();
  },

  async createEducation(data: CreateEducationData): Promise<Education> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/api/v1/users/me/education`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new ApiError(res.status, "Failed to create education");
    return res.json();
  },

  async updateEducation(
    id: string,
    data: UpdateEducationData,
  ): Promise<Education> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/api/v1/users/me/education/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new ApiError(res.status, "Failed to update education");
    return res.json();
  },

  async deleteEducation(id: string): Promise<void> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/api/v1/users/me/education/${id}`, {
      method: "DELETE",
      headers,
    });
    if (!res.ok) throw new ApiError(res.status, "Failed to delete education");
  },
  
  async getMyExperience(): Promise<Experience[]> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/api/v1/users/me/experience`, {
      headers,
    });
    if (!res.ok) throw new ApiError(res.status, "Failed to fetch experience");
    return res.json();
  },

  async createExperience(data: CreateExperienceData): Promise<Experience> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/api/v1/users/me/experience`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new ApiError(res.status, "Failed to create experience");
    return res.json();
  },

  async updateExperience(
    id: string,
    data: UpdateExperienceData,
  ): Promise<Experience> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/api/v1/users/me/experience/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new ApiError(res.status, "Failed to update experience");
    return res.json();
  },

  async deleteExperience(id: string): Promise<void> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/api/v1/users/me/experience/${id}`, {
      method: "DELETE",
      headers,
    });
    if (!res.ok) throw new ApiError(res.status, "Failed to delete experience");
  },
};
