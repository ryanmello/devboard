import Image from "next/image";
import { getSkillImage } from "@/hooks/skills";

interface SkillPreviewProps {
  skills: string[];
}

const SkillPreview = ({ skills }: SkillPreviewProps) => {
  if (skills.length === 0) {
    return (
      <div className="w-full border border-secondary/80 rounded-xl p-4 mb-4">
        <p className="text-sm text-muted-foreground text-center">
          Select skills to see how they will appear on your profile
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-wrap border border-secondary/80 rounded-xl p-2 mb-4">
        {skills.map((skill) => {
          const image = getSkillImage(skill);

          return (
            <div key={skill}>
              <Image
                src={image}
                alt={skill}
                height={50}
                width={50}
                className="rounded-md p-1"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SkillPreview;
