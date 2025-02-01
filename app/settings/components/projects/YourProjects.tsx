"use client";

import { Project } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Github, Globe, Pencil, Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";
import EditProjectForm from "./EditProjectForm";

const YourProjects = ({
  currentUser,
}: {
  currentUser: { projects: Project[] };
}) => {
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async (projectId: string) => {
    try {
      setIsLoading(true);
      await axios.post(`/api/project/delete`, {
        projectId: projectId,
      });
      toast.success("Project deleted successfully");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <div className="pt-8 w-1/2">
      <h2 className="text-xl font-bold pb-2">Your Projects</h2>
      <div className="space-y-4">
        {currentUser.projects?.map((project) => (
          <Card key={project.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{project.name}</span>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelectedProject(project);
                      setIsEditDialogOpen(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelectedProject(project);
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    <Trash className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>{project.primaryLanguage}</CardDescription>
            </CardHeader>
            <CardContent>
              {project.description && (
                <p className="text-sm text-muted-foreground">
                  {project.description}
                </p>
              )}
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={project.gitHubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="h-4 w-4 mr-2" />
                    GitHub
                  </a>
                </Button>
                {project.url && (
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Globe className="h-4 w-4 mr-2" />
                      Live Demo
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              project.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                selectedProject && handleDelete(selectedProject.id)
              }
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Project Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>
          {selectedProject && (
            <EditProjectForm
              project={selectedProject}
              onSuccess={() => {
                setIsEditDialogOpen(false);
                router.refresh();
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default YourProjects;
