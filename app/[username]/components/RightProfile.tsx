"use client";

import { FullUser } from "@/types";
import GitHubHeatmap from "./github/GitHubHeatmap";
import LeetCode from "./leetcode/LeetCode";
import { BriefcaseBusiness, Github, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BsBriefcase } from "react-icons/bs";
import { PiGraduationCap } from "react-icons/pi";
import { GoProject } from "react-icons/go";
import Image from "next/image";
import { getSkillImage } from "@/hooks/skills";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const RightProfile = ({ user }: { user: FullUser }) => {
  return (
    <div className="w-3/4 2xl:w-4/5">
      {/* SKILLS */}
      {user.skills.length > 0 && (
        <div className="bg-secondary/80 rounded-xl p-4 mb-4">
          <div className="flex flex-wrap">
            <TooltipProvider>
              {user.skills.map((skill) => {
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
      )}

      {/* LEETCODE STATS */}
      {user.leetCodeUsername && (
        <LeetCode leetCodeUsername={user.leetCodeUsername} />
      )}

      {/* GITHUB STATS */}
      {user.gitHubUsername && (
        <GitHubHeatmap gitHubUsername={user.gitHubUsername} />
      )}

      {/* PROJECTS */}
      {user.projects && user.projects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {user.projects.map((project) => (
            <div key={project.id} className="flex flex-col border rounded-lg p-4 bg-secondary/80">
              <div className="flex gap-4">
                <GoProject className="w-6 h-6 text-primary mt-1" />
                <div className="flex-1">
                  <div className="flex flex-col">
                    <div className="flex justify-between items-center">
                      <h3 className="text-base font-semibold text-foreground">
                        {project.name}
                      </h3>
                      <div className="flex gap-2">
                        {project.gitHubUrl && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 bg-transparent hover:bg-primary/10"
                            asChild
                          >
                            <a
                              href={project.gitHubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Github className="h-4 w-4 text-primary" />
                            </a>
                          </Button>
                        )}
                        {project.url && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 bg-transparent hover:bg-primary/10"
                            asChild
                          >
                            <a
                              href={project.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Globe className="h-4 w-4 text-primary" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                    {project.primaryLanguage && (
                      <div className="text-sm font-medium text-foreground/80">
                        {project.primaryLanguage}
                      </div>
                    )}
                    {project.description && (
                      <div className="mt-2 text-sm text-muted-foreground whitespace-pre-line">
                        {project.description}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* EXPERIENCE */}
      {user.experience && user.experience.length > 0 && (
        <div className="space-y-6 mb-4 bg-secondary/80 rounded-xl p-4">
          <h2 className="text-xl font-bold">Experience</h2>
          {user.experience.map((exp) => (
            <div key={exp.id} className="flex gap-2">
              <div className="w-12 h-12 flex bg-primary/10 rounded-lg justify-center items-center shrink-0">
                <BsBriefcase className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex flex-col">
                  <h3 className="text-base font-semibold text-foreground">
                    {exp.title}
                  </h3>
                  <div className="text-sm font-medium text-foreground/80">
                    {exp.company}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {exp.startMonth} {exp.startYear} -
                    {exp.isCurrent ? (
                      " Present"
                    ) : (
                      <span>
                        {" "}
                        {exp.endMonth} {exp.endYear}
                      </span>
                    )}
                    {" • "}
                    {exp.location}
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground whitespace-pre-line">
                    {exp.description}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* EDUCATION */}
      {user.education && user.education.length > 0 && (
        <div className="space-y-6 mb-4 bg-secondary/80 rounded-xl p-4">
          <h2 className="text-xl font-bold">Education</h2>
          {user.education.map((edu) => (
            <div key={edu.id} className="flex gap-2">
              <div className="w-12 h-12 flex bg-primary/10 rounded-lg justify-center items-center shrink-0">
                <PiGraduationCap className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex flex-col">
                  <h3 className="text-base font-semibold text-foreground">
                    {edu.universityName}
                  </h3>
                  <div className="text-sm font-medium text-foreground/80">
                    {edu.major} {edu.minor && `• Minor in ${edu.minor}`}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {edu.startYear} - {edu.graduationYear}
                    {edu.gpa && (
                      <>
                        {" • "}
                        GPA: {edu.gpa}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RightProfile;
