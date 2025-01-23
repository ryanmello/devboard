"use client";

import { FullUser, SettingsVariant } from "@/types";
import ProfileTab from "../tabs/ProfileTab";
import { useEffect, useState } from "react";
import SkillsTab from "../tabs/SkillsTab";
import EducationTab from "../tabs/EducationTab";
import ExperienceTab from "../tabs/ExperienceTab";
import ProjectsTab from "../tabs/ProjectsTab";
import SettingsSidebar from "./SettingsSidebar";
import axios from "axios";

const Settings = ({ clerkId }: { clerkId: string | null }) => {
  const [variant, setVariant] = useState<SettingsVariant>("Profile");
  const [currentUser, setCurrentUser] = useState<FullUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!clerkId) {
          setLoading(false);
          return;
        }

        const response = await axios.post("/api/user/fetch/clerkId", { clerkId });

        const user = response.data;
        setCurrentUser(user);
      } catch (error) {
        console.error("Failed to fetch user", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [clerkId]);

  if (!currentUser) {
    return <SettingsSidebar variant={variant} setVariant={setVariant} />;
  }

  return (
    <div>
      <SettingsSidebar variant={variant} setVariant={setVariant} />
      <div className="ml-64">
        {variant == "Profile" && <ProfileTab currentUser={currentUser} />}
        {variant == "Skills" && <SkillsTab currentUser={currentUser} />}
        {variant == "Education" && <EducationTab currentUser={currentUser} />}
        {variant == "Experience" && <ExperienceTab currentUser={currentUser} />}
        {variant == "Projects" && <ProjectsTab currentUser={currentUser} />}
      </div>
    </div>
  );
};

export default Settings;
