import { Project } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Github, Globe } from "lucide-react";
// import Image from 'next/image';

const YourProjects = ({
  currentUser,
}: {
  currentUser: { projects: Project[] };
}) => {
  return (
    <div className="pt-8 w-1/2">
      <h2 className="text-xl font-bold pb-2">Your Projects</h2>
      <div className="space-y-4">
        {currentUser.projects?.map((project) => (
          <Card key={project.id}>
            <CardHeader>
              <CardTitle>{project.name}</CardTitle>
              <CardDescription>{project.primaryLanguage}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                {/* {project.image && (
                  <div className="relative w-full h-48">
                    <Image
                      src={project.image}
                      alt={project.name}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                )} */}
                {project.description && (
                  <p className="text-sm text-muted-foreground">
                    {project.description}
                  </p>
                )}
                <div className="flex gap-2">
                  <a
                    href={project.gitHubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1"
                  >
                    <Github className="h-4 w-4" />
                    GitHub
                  </a>
                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1"
                    >
                      <Globe className="h-4 w-4" />
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default YourProjects;
