import { useBackendSkills } from "@/hooks/skills";
import React, { Dispatch, SetStateAction } from "react";
import SkillItem from "./SkillItem";

interface BackendProps {
  skills: string[];
  setSkills: Dispatch<SetStateAction<string[]>>;
}

const Backend = ({ skills, setSkills }: BackendProps) => {
  const backendSkills = useBackendSkills();

  return (
    <div className="w-full mt-4">
      <h2 className="font-bold text-xl flex items-start">Backend</h2>
      <div className="flex flex-wrap bg-secondary/80 rounded-xl p-2">
        {backendSkills.map((skill) => (
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

export default Backend;