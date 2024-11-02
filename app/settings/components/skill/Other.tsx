import { useOtherSkills } from "@/hooks/skills";
import React, { Dispatch, SetStateAction } from "react";
import SkillItem from "./SkillItem";

interface OtherProps {
  skills: string[];
  setSkills: Dispatch<SetStateAction<string[]>>;
}

const Other = ({ skills, setSkills }: OtherProps) => {
  const otherSkills = useOtherSkills();

  return (
    <div className="w-full mt-4">
      <h2 className="font-bold text-xl flex items-start">Other</h2>
      <div className="flex bg-secondary/80 rounded-xl p-2">
        {otherSkills.map((skill) => (
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

export default Other;
