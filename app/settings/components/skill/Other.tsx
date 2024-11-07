import { useOtherSkills } from "@/hooks/skills";
import React, { Dispatch, SetStateAction } from "react";
import SkillItem from "./SkillItem";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface OtherProps {
  skills: string[];
  setSkills: Dispatch<SetStateAction<string[]>>;
}

const Other = ({ skills, setSkills }: OtherProps) => {
  const otherSkills = useOtherSkills();

  return (
    <div className="w-full">
      <h2 className="font-semibold text-xl flex items-start mb-1">Other</h2>
      <div className="flex flex-wrap border border-secondary/80 rounded-xl p-2">
        <TooltipProvider>
          {otherSkills.map((skill) => (
            <Tooltip key={skill.name}>
              <TooltipTrigger>
                <SkillItem
                  name={skill.name}
                  image={skill.image}
                  skills={skills}
                  setSkills={setSkills}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>{skill.name}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>
    </div>
  );
};

export default Other;
