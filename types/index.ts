import { Education, Experience, Project } from "@prisma/client";

export type FullUser = {
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

export type SettingsVariant =
  | "Profile"
  | "Skills"
  | "Education"
  | "Experience"
  | "Projects";