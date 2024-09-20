"use client";

import { FullUser, SettingsVariant } from "@/types";
import ProfileTab from "../tabs/ProfileTab";
import { useState } from "react";
import SkillsTab from "../tabs/SkillsTab";
import EducationTab from "../tabs/EducationTab";
import ExperienceTab from "../tabs/ExperienceTab";
import ProjectsTab from "../tabs/ProjectsTab";
import SettingsSidebar from "./SettingsSidebar";

const Settings = ({ currentUser }: { currentUser: FullUser }) => {
  const [variant, setVariant] = useState<SettingsVariant>("Profile");

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
