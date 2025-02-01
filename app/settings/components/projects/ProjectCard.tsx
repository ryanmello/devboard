import { Project } from "@prisma/client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Github, Globe, Pencil, Trash } from "lucide-react";
import Image from "next/image";
import axios from "axios";
import { toast } from "sonner";
import { useState } from "react";

interface ProjectCardProps {
  project: Project;
  onDelete?: () => void;
}

const ProjectCard = ({ project, onDelete }: ProjectCardProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/projects/${project.id}`);
      toast.success("Project deleted successfully!");
      onDelete?.();
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{project.name}</span>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon">
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              disabled={isLoading}
            >
              <Trash className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {project.image && (
          <div className="relative w-full h-48">
            <Image
              src={project.image}
              alt={project.name}
              fill
              className="object-cover rounded-lg"
            />
          </div>
        )}
        {project.description && (
          <p className="text-sm text-muted-foreground">{project.description}</p>
        )}
        <p className="text-sm text-muted-foreground">
          Primary Language: {project.primaryLanguage}
        </p>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="outline" size="sm" asChild>
          <a href={project.gitHubUrl} target="_blank" rel="noopener noreferrer">
            <Github className="h-4 w-4 mr-2" />
            GitHub
          </a>
        </Button>
        {project.url && (
          <Button variant="outline" size="sm" asChild>
            <a href={project.url} target="_blank" rel="noopener noreferrer">
              <Globe className="h-4 w-4 mr-2" />
              Live Demo
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
