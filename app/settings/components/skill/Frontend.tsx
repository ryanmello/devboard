import { useFrontendSkills } from "@/hooks/skills";
import React, { Dispatch, SetStateAction } from "react";
import SkillItem from "./SkillItem";

interface FrontendProps {
  skills: string[];
  setSkills: Dispatch<SetStateAction<string[]>>;
}

const Frontend = ({ skills, setSkills }: FrontendProps) => {
  const frontendSkills = useFrontendSkills();

  return (
    <div className="w-full mt-4">
      <h2 className="font-semibold text-xl flex items-start mb-1">Frontend</h2>
      <div className="flex flex-wrap border border-secondary/80 rounded-xl p-2">
        {frontendSkills.map((skill) => (
          <div key={skill.name} className="flex items-center">
            <SkillItem
              name={skill.name}
              image={skill.image}
              skills={skills}
              setSkills={setSkills}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Frontend;