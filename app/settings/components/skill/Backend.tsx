import { useBackendSkills } from "@/hooks/skills";
import React, { Dispatch, SetStateAction } from "react";
import SkillItem from "./SkillItem";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface BackendProps {
  skills: string[];
  setSkills: Dispatch<SetStateAction<string[]>>;
}

const Backend = ({ skills, setSkills }: BackendProps) => {
  const backendSkills = useBackendSkills();

  return (
    <div className="w-full">
      <h2 className="font-semibold text-xl flex items-start mb-1">Backend</h2>
      <div className="flex flex-wrap border border-secondary/80 rounded-xl p-2">
        <TooltipProvider>
          {backendSkills.map((skill) => (
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

export default Backend;