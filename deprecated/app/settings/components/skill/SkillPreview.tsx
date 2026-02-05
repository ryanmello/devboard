import Image from "next/image";
import { getSkillImage } from "@/hooks/skills";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SkillPreviewProps {
  skills: string[];
}

const SkillPreview = ({ skills }: SkillPreviewProps) => {
  if (skills.length === 0) {
    return (
      <div className="w-full border-2 border-dashed rounded-xl p-6">
        <p className="text-center text-muted-foreground text-sm">
          Select skills to see how they will appear on your profile.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-wrap border border-secondary/80 rounded-xl p-2 mb-4">
        <TooltipProvider>
          {skills.map((skill) => {
            const image = getSkillImage(skill);

            return (
              <Tooltip key={skill}>
                <TooltipTrigger>
                  <div>
                    <Image
                      src={image}
                      alt={skill}
                      height={50}
                      width={50}
                      className="rounded-md p-1"
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{skill}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </div>
    </div>
  );
};

export default SkillPreview;
