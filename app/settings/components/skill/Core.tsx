import { useCoreLanguages } from "@/hooks/skills";
import React, { Dispatch, SetStateAction } from "react";
import SkillItem from "./SkillItem";

interface CoreProps {
  skills: string[];
  setSkills: Dispatch<SetStateAction<string[]>>;
}

const Core = ({ skills, setSkills }: CoreProps) => {
  const coreSkills = useCoreLanguages();

  return (
    <div className="w-full mt-4">
      <h2 className="font-bold text-xl flex items-start">Core Languages</h2>
      <div className="flex flex-wrap bg-secondary/80 rounded-xl p-2">
        {coreSkills.map((skill) => (
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

export default Core;